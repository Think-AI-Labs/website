import { existsSync } from "fs";
import { resolve } from "path";
import { createComponentDocsPage } from "./componentPage";
import { createModalDocsPage } from "./modalPage";
import { fixLinks } from "./fixLinks";
import {
  createDocsPage,
  prepareData,
  sortGroupOfNavigation,
  prepareWebsitePaths,
  preparePreviewPaths,
} from "./helpers";
import { DocsNavigation } from "../utils";
import {
  CreatePageFn,
  CreateRedirectFn,
  GraphQLFunction,
} from "../../../types";
import { BuildFor } from "../../../../src/types/common";
import { DocsRepository } from "./types";

import config from "../../../../config.json";
import { DocsNavigationElement } from "@typings/docs";
import { DOCS_LATEST_VERSION } from "../../../constants";

export interface CreateDocsPages {
  graphql: GraphQLFunction;
  createPage: CreatePageFn;
  createRedirect: CreateRedirectFn;
  buildFor: BuildFor;
  prepareForRepo?: string;
}

export const createDocsPages = async (options: CreateDocsPages) => {
  const reposData: { [repo: string]: DocsRepository } = config.docs;
  const repositoryName = options.prepareForRepo;

  if (repositoryName) {
    await createDocsPagesPerRepo(
      repositoryName,
      reposData[repositoryName],
      options,
    );
    return;
  }

  for (const [repoName, repository] of Object.entries(config.docs)) {
    await createDocsPagesPerRepo(repoName, repository, options);
  }
};

const createDocsPagesPerRepo = async (
  repositoryName: string,
  repository: DocsRepository,
  {
    graphql,
    createPage: createPageFn,
    createRedirect,
    buildFor,
  }: CreateDocsPages,
) => {
  const pathToRepo = resolve(
    __dirname,
    `../../../../content/docs/${repositoryName}`,
  );
  if (!existsSync(pathToRepo)) {
    return;
  }

  const preparePaths =
    buildFor === BuildFor.DOCS_PREVIEW
      ? preparePreviewPaths
      : prepareWebsitePaths;

  const preparedData = await prepareData({ graphql, buildFor, repositoryName });
  if (!preparedData) {
    return;
  }
  const { versions, latestVersion, docsArch } = preparedData;

  Object.keys(docsArch).map(version => {
    const { content, navigation } = docsArch[version];
    // const sortedNavigation: DocsNavigation = sortGroupOfNavigation({});
    // const sortedNavigation: DocsNavigationElement[] = navigation

    const v =
      !version || version === DOCS_LATEST_VERSION ? latestVersion : version;

    Object.keys(content).map(topic => {
      const {
        assetsPath,
        specificationsPath,
        modalUrlPrefix,
        pagePath,
        rootPagePath,
      } = preparePaths({
        repositoryName,
        version,
        latestVersion: latestVersion || "",
        docsType: "",
        topic,
      });

      let fixedContent = content[topic];
      if (buildFor !== BuildFor.DOCS_PREVIEW) {
        fixedContent = fixLinks({
          content: fixedContent,
          version,
        });
      }
      const specifications = fixedContent.specifications.map(specification => ({
        ...specification,
        assetPath: `${specificationsPath}/${specification.assetPath}`,
        pageUrl: `${modalUrlPrefix}/${specification.id}`,
      }));

      const basePath = rootPagePath;
      const context = {
        content: fixedContent,
        navigation,
        manifest: navigation,
        versions,
        version,
        pagePath,
        assetsPath,
        basePath,
        docsType: "",
        topic,
        specifications,
        repositoryName,
      };

      const createPage = createDocsPage(createPageFn, context);
      createComponentDocsPage({
        createPage,
        createRedirect,
        context,
        path: pagePath,
        rootPath: "",
        repository,
      });
      createModalDocsPage({ createPage, context });
    });
  });
  // });
};

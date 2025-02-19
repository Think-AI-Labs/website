---
title: Application Connector
---

Application Connector (AC) is a custom, in-house built Kyma component that allows you to connect with external solutions. No matter if you want to integrate an on-premise or a cloud system, the integration process does not change, which allows to avoid any configuration or network-related problems.

The external solution you connect to Kyma using AC is represented as an Application. There is always a one-to-one relationship between a connected solution and an Application, which helps to ensure the highest level of security and separation. This means that you must create five separate Applications in your cluster to connect five different external solutions and use their APIs and event catalogs in Kyma.

Application Connector is secured with a client certificate verified by the Istio Ingress Gateway. The certificates are generated and stored as Kubernetes Secrets by Application Connector Certs Setup job. By default, the server key and certificate are automatically generated, but you can [provide a custom server certificate and key](../../../04-operation-guides/operations/ac-03-application-connector-certificates.md) during installation.

Application Connector:

- Manages lifecycles of Applications.
- Establishes a secure connection and generates the client certificate used by the connected external solution.
- Registers APIs and event catalogs of the connected external solution.
- Delivers events from the connected external solution to Eventing.
- Proxies calls sent from Kyma to external APIs registered by the connected external solution.
- Allows to map an Application to a Kyma Namespace and use its registered APIs and event catalogs in the context of that Namespace.
- Integrates the registered APIs and event catalogs with the Kyma Service Catalog.

All of the AC components scale independently, which allows to adjust it to fit the needs of the implementation built using Kyma.

## Supported APIs

Application Connector allows you to [register secured REST APIs](../../../04-operation-guides/operations/ac-02-api-registration.md) exposed by the connected external solution. Application Connector supports a variety of authentication methods to ensure smooth integration with a wide range of APIs.

You can register an API secured with one of the following authentication methods:

- Basic Authentication
- OAuth
- Client Certificates

> **NOTE:** You can register non-secured APIs for testing purposes, however, it is not recommended in the production environment.

In addition to authentication methods, Application Connector supports Cross-Site Request Forgery (CSRF) Tokens.

You can register any API that adheres to the REST principles and is available over the HTTP protocol. Application Connector also allows you to register APIs implemented with the OData technology.

You can provide specifications that document your APIs. Application Connector supports [AsyncAPI](https://www.asyncapi.com/), [OpenAPI](https://www.openapis.org/), and [OData](https://www.odata.org/documentation) specification formats.

>**TIP:** Read about the [AsyncAPI Service used in Kyma](https://github.com/kyma-project/rafter/blob/main/docs/12-asyncapi-service.md) to process AsyncAPI specifications.

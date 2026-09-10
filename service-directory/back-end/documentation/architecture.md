# Service Directory API — Architecture

The Service Directory API is a module from ICE Orchestration.
It’s an API developed using the [Nest.js framework](https://nestjs.com).

Its purpose is to be a back-end to the Service Directory UI, and to be called directly from the Process Designer.
Services (external APIs described by OpenAPI) can be added to the Service Directory, and services that are in the Service Directory can be used in BPMN processes via the Process Designer.

Each service must be described by an OpenAPI specification, which can be supplied either via a URL or saved directly on the service in the Service Directory.
OpenAPI specs can include “common definitions”, which are fragments of OpenAPI spec that can be reused across multiple specifications.

Services that require authentication can have this information saved as a “security definition”, but this is not in the Service Directory API.
Rather, security definitions are in the Process Engine Gateway API.

In addition to services and common definitions, the Service Directory API also supports “single endpoints”.
This is a legacy feature that is not used elsewhere in Orchestration.
Each single endpoint represents one URL from an external API, without OpenAPI.

## Libraries used in the Service Directory API

- Nest.js, core framework
- Swagger, for describing the Service Directory API with an OpenAPI specification and Swagger UI
- Mongoose, object-relational mapper for the MongoDB database
- Keycloak, for authenticating users from details provided by the ICE Orchestration Portal Header via the Process Designer or Service Directory UI
- Rx.js, library used for observable streams (eg in the logging interceptor)
- js-yaml, parser for Yaml (only used in the `validatedOpenApiDefinition` function)
- Swagger parser (only used in the `validatedOpenApiDefinition` function)

## Service Directory API modules

The Service Directory API leverages Nest.js modules, and each of its functionalities is grouped under its corresponding module.

### `AppModule`

`AppModule` (src/app-module.ts) is the base module for the entire Nest.js application.
All the other Nest.js modules are imported in this module.

This is where Keycloak and Mongoose are configured at a basic level, with configuration values coming from environment variables.

It is also where Nest.js is told to use the Service Directory API’s logging interceptor and HTTP exception filter, which are applied across all endpoints.

`AppModule` has one endpoint of its own, at the root of the API (`GET /`).
It returns the string `"Hello World"`, as a property named `message` in a Json object.

In fact, all endpoints in the Service Directory API return valid Json, with the possible exception of `GET /definitions/value/{name}` which may return a Yaml string (not necessarily Json).

### Other modules in the Service Directory API

These Nest.js modules are separated into subfolders of /src/app.
Each module except `CoreModule` handles its own type of database object in its own MongoDB collection.

- [/core](./core.md) (Nest.js filters and interceptors and utility methods used across the application)
- [/definitions](./definitions.md) (common definitions)
- [/service](./service.md) (records of external APIs described by OpenAPI)
- [/single-endpoint](./single-endpoint.md)-endpoint (records of external API endpoints without OpenAPI)

(The use of the plural for “definitions” and the singular for “service” and “single-endpoint” is of no meaning.)

Each module (except `CoreModule`) has its own endpoints that share a common base-path on the URL that matches the subfolder.
(So each endpoint in `ServiceModule` has a URL beginning with `/service` for example.)

The endpoints (for each module) are described by:

- a Nest.js controller, in a \*.controller.ts file;
- unit tests for the controller, in a \*.controller.spec.ts file;
- a Nest.js service, in a \*.service.ts file;

The relevant Mongoose schema is in a \*.schema.ts file.

The information that is expected to be passed to each endpoint in a request-body is called a DTO (domain-transfer object).
The TypeScript types for these are in \*.dto.ts files inside a dedicated /dto folder inside the module folder.

(DTOs are not required for GET endpoints; all the necessary information is in the URL.)

Modules may also have a \*.utils.ts file containing utility functions.

## API request pipeline

In Nest.js, there are multiple stages that a request passes through before the response is returned to the client.
These stages together are called the request pipeline.
Here are the stages in order:

### Middleware

Nest.js middleware is not used in the Service Directory API.

### Guards

The Service Directory API imports guards from Keycloak to prevent unauthenticated access.
All endpoints except the root “Hello World!” endpoint (`GET /`) are protected in this way.

### Interceptor before route-handling

A Nest.js interceptor has an `intercept` function that specifies code to run before the route-handling stage as well as code to run afterwards.
In this API, there is one interceptor and it is used for logging the request, then it is used for logging the response (and other data about the request).

### Pipes

Nest.js pipes are not used in the Service Directory API.

### Route-handler

Nest.js route-handling involves a Nest.js controller and a Nest.js service.
These are specific to each module.

The controller contains a method for each endpoint, decorated with a HTTP verb for Nest.js and annotations for OpenAPI/Swagger.
These methods often contain custom error-handling: eg, they might throw HTTP exceptions if an ID or other necessary information is missing from the request.

The annotations for OpenAPI/Swagger on controller methods give the endpoint a description, and list the potential status-codes that the endpoint returns, including a description of the meaning of each status-code.
The decoration for a 200/201 response includes the data-type of the response (eg `Service` or `Definition`).

The expected input for the endpoint also has an OpenAPI/Swagger decoration, such as `@Body()` or `@Param()`, depending on whether it’s from the request-body or a URL parameter.
(Query-strings are not used in the Service Directory.)

Methods in the controller do not call the database/Mongoose directly.
Each method in the controller calls a method in the Nest.js service, which in turn makes a database call via Mongoose.

### Interceptor after route-handling

As explained above, the interceptor runs code before and after the route-handling.
In the Service Directory API, it does logging.

### Filters

The Service Directory API uses a Nest.js filter to catch HTTP exceptions.
These are processed into a sensible response-object (in Json format) so they don’t crash the application.

For example, if a request is made to an endpoint that doesn’t exist in the API, the response might be:

```json
{ "error": "Cannot GET /nonsense", "statusCode": 404, "success": false }
```

Controllers and Nest.js services can throw their own HTTP exceptions.
These will be caught by the filter and handled correctly.

```ts
if (!id) {
	throw new HttpException('`id` is required.', 400);
}
```

Filters are the final stage in the pipeline before the client receives the response.

## Tests

See [tests documentation](./tests.md).

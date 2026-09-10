# Service Directory API — `ServiceModule`

This is the module that deals with the services that the Service Directory exists for.
These are external APIs that are described by OpenAPI specifications — or rather, they are the records of such APIs that allow the APIs to be used in Orchestration.

The name of the MongoDB collection is `services`.
The schema is defined with Mongoose in /src/service/service.schema.ts.

Like other Nest.js modules, this module has a Nest.js controller (`ServiceController`) and a Nest.js service (`ServiceService`).
The controller calls the Nest.js service, which in turn calls Mongoose methods to create/read/update/delete services in the database.

The controller also makes use of a utility method named `validateService` in /src/service/service.utils.ts.
This prevents a service being saved with invalid properties.

Unit tests are in /src/service/service.controller.spec.ts.
End-to-end tests are in /test/service.e2e-spec.ts.
Tests use mock values in /src/service/mock-service-service.ts.

Some endpoints expect to receive data in the request-body.
The expected formats for this are given by DTO types, in the /src/service/dto folder.

## `ServiceModule` endpoints

The module has five endpoints for working with the services in the Service Directory.
They are all protected by Keycloak, and they are all described by OpenAPI/Swagger.

The endpoints are listed below.

### `GET /service`

Returns all services in the database.

### `POST /service`

Adds a service to the database.
It might throw a 400 error if the request-body doesn’t match `CreateServiceDTO` (meaning properties are missing or invalid), or if the new service would have the same name as an existing service.

The properties `user`, `company`, and `organization` exist on services.
They come from the Keycloak user that created the service in the Service Directory UI.
The three properties are optional to allow the Service Directory to be used without Keycloak if Keycloak is not configured (eg in development mode).

If the service was posted successfully, it is returned as it is now in the database.

### `PATCH /service`

Updates a service in the database, but only the fields given, and returns the updated service.
It might throw a 400 error if the request-body doesn’t match `PatchServiceDTO`, or if the service would have the same name as another service, or if the edit would remove required properties.

It throws a 404 error if the ID given does not match an existing service.

If the service was patched successfully, it is returned as it is now in the database.

### `DELETE /service`

Deletes a service from the database.
It might throw a 400 error if the request-body doesn’t match `DeleteServiceDTO` — ie if it’s not a Json object with an `_id` property.

That one property is the ID of the service to delete.
The controller throws a 404 error if the ID does not match an existing service.

It returns the service that was deleted.

### `GET /service/{id}`

Returns one service from the database.
It throws a 404 error if the ID in the URL does not match an existing service.

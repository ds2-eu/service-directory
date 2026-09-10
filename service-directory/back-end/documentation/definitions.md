# Service Directory API — `DefinitionsModule`

This is the module that deals with common definitions.
These are extracts of OpenAPI specification that can be reused inside the OpenAPI specs for services.

The name of the MongoDB collection is `definitions`.
The schema is defined with Mongoose in /src/definitions/definitions.schema.ts.

Like other Nest.js modules, this module has a Nest.js controller (`DefinitionsController`) and a Nest.js service (`DefinitionsService`).
The controller calls the Nest.js service, which in turn calls Mongoose methods to create/read/update/delete common definitions in the database.

Unit tests are in /src/definitions/definitions.controller.spec.ts.
End-to-end tests are in /test/definitions.e2e-spec.ts.
Tests use mock values in /src/definitions/mock-definitions-service.ts.

Some endpoints expect to receive data in the request-body.
The expected formats for this are given by DTO types, in the /src/definitions/dto folder.

`DefinitionsService` has a `ToDTO` function that converts a common definition from the database into the `DefinitionDTO` type.
(This type is defined in the same folder as the other DTO types.)
All endpoints that return common definitions use this function, so the return values match the type rather than being exactly what is in the database.
The only difference is that MongoDB stores IDs in the `_id` property, but the DTOs for common definitions have an `id` property (without the underscore).

## `DefinitionsModule` endpoints

The module has six endpoints for working with the common definitions in the Service Directory.
They are all protected by Keycloak, and they are all described by OpenAPI/Swagger.

The endpoints are listed below.

### `GET /definitions`

Returns all common definitions in the database.

### `POST /definitions`

Adds a common definition to the database.
It might throw a 400 error if the request-body doesn’t match `CreateDefinitionDTO` (meaning properties are missing or invalid).

Unlike services and single endpoints, common definitions do not have the properties `user`, `company`, and `organization`, which would associate the definitions with Keycloak users in Orchestration.
Common definitions are intended to be used in the OpenAPI specs belonging to any user.

If the common definition was posted successfully, it is returned as it is now in the database (but with MongoDB’s `_id` changed to `id`).

### `PATCH /definitions`

Updates a common definition in the database and returns the updated common definition.
It might throw a 400 error if the request-body doesn’t match `PatchDefinitionDTO` or if the edit would remove required properties.

Unlike other PATCH endpoints, this endpoint replaces all fields of the existing common definition with the new fields in the DTO.
Even if a property doesn’t need to change, it must be supplied in the DTO.

It throws a 404 error if the ID given does not match an existing common definition.

If the common definition was patched successfully, it is returned as it is now in the database (but with MongoDB’s `_id` changed to `id`).

Updates a single endpoint in the database and returns the updated single endpoint.
It might throw a 400 error if the request-body doesn’t match `PatchSingleEndpointDTO` or if the edit would remove required properties.

### `DELETE /definitions`

Deletes a common definition from the database.
It might throw a 400 error if the request-body doesn’t match `DeleteDefinitionDTO` — ie if it’s not a Json object with an `_id` property.

That one property is the ID of the common definition to delete.
The controller throws a 404 error if the ID does not match an existing common definition.

It returns the common definition that was deleted.

### `GET /definitions/{id}`

Returns one common definition from the database.
It throws a 404 error if the ID in the URL does not match an existing common definition.

### `GET /definitions/value/{name}`

Looks for a common definition with the given name in the database, and returns its `value` property.
This should be a Json (or Yaml) string that could be part of an OpenAPI specification.

The endpoint returns null if the name in the URL does not match an existing common definition.

# Service Directory API — `SingleEndpointModule`

This is the module that deals with single endpoints.
These are records of external API endpoints that are not described by OpenAPI specifications.
Each single endpoint has a name, a URL, and an optional description.

Single endpoints are not used anywhere in Orchestration.
They are a legacy feature from before Orchestration started using OpenAPI.

The name of the MongoDB collection is `singleendpoints`.
The schema is defined with Mongoose in /src/single-endpoint/single-endpoint.schema.ts.

Like other Nest.js modules, this module has a Nest.js controller (`SingleEndpointController`) and a Nest.js service (`SingleEndpointService`).
The controller calls the Nest.js service, which in turn calls Mongoose methods to create/read/update/delete single endpoints in the database.

Unit tests are in /src/single-endpoint/single-endpoint.controller.spec.ts.
The mock values that the unit tests use are in that file.
There are no end-to-end tests for this module.

Some endpoints expect to receive data in the request-body.
The expected formats for this are given by DTO types, in the /src/single-endpoint/dto folder.

## `SingleEndpointModule` endpoints

The module has five endpoints for working with the single endpoints in the Service Directory.
They are all protected by Keycloak, and they are all described by OpenAPI/Swagger.

The endpoints are listed below.

### `GET /single-endpoint`

Returns all single endpoints in the database.

### `POST /single-endpoint`

Adds a single endpoint to the database.
It might throw a 400 error if the request-body doesn’t match `CreateSingleEndpointDTO` (meaning properties are missing or invalid).

The properties `user`, `company`, and `organization` exist on single endpoints.
They would come from the Keycloak user that created the single endpoint in the Service Directory UI (if the UI supported single endpoints).
The three properties are optional to allow the Service Directory to be used without Keycloak if Keycloak is not configured (eg in development mode).

If the single endpoint was posted successfully, it is returned as it is now in the database.

### `PATCH /single-endpoint`

Updates a single endpoint in the database and returns the updated single endpoint.
It might throw a 400 error if the request-body doesn’t match `PatchSingleEndpointDTO` or if the edit would remove required properties.

Unlike other PATCH endpoints, this endpoint replaces all fields of the existing single endpoint with the new fields in the DTO.
So if `description` (an optional property) is omitted from the DTO, the description will be deleted from the single endpoint.

It throws a 404 error if the ID given does not match an existing single endpoint.

If the single endpoint was patched successfully, it is returned as it is now in the database.

### `DELETE /single-endpoint`

Deletes a single endpoint from the database.
It might throw a 400 error if the request-body doesn’t match `DeleteSingleEndpointDTO` — ie if it’s not a Json object with an `_id` property.

That one property is the ID of the single endpoint to delete.
The controller throws a 404 error if the ID does not match an existing single endpoint.

It returns the single endpoint that was deleted.

### `GET /single-endpoint/{id}`

Returns one single endpoint from the database.
It throws a 404 error if the ID in the URL does not match an existing single endpoint.

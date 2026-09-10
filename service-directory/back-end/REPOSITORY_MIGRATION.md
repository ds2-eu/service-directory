# Shared Objects Repository migration

This implementation replaces the Service Directory MongoDB persistence layer with the ICE Objects Repository while preserving the existing Service Directory REST API used by the Angular frontend.

## Confirmed architecture

All Service Directory installations that point at the same Objects Repository use the same logical owner namespace:

```text
REPOSITORY_OWNER_ID=service-directory
```

That is deliberate. `ownerId` identifies the shared catalogue, not the logged-in user or organisation. This lets APIs registered by one user/install be visible to every other Service Directory install using the same repository.

User/company/organisation information remains on service and single-endpoint records as metadata for attribution. It must not be used to partition repository searches if the directory is intended to be global/shared.

## Server-side authentication

The Objects Repository implementation checks a configured `API-KEY` header (or query parameter). The key is not tied to an owner in the repository implementation. Service Directory therefore supplies the key from the backend environment:

```text
REPOSITORY_API_URL=https://dlmstorebackend.idta.ds2.icelab.cloud/repository-api
REPOSITORY_OWNER_ID=service-directory
REPOSITORY_API_KEY=<deployment secret>
```

Do not put `REPOSITORY_API_KEY` in the Angular app or browser configuration. Keycloak/Portal Header authenticates the user to Service Directory; the Service Directory backend separately authenticates itself to Objects Repository.

## Storage mapping

- `service` -> repository object type `service`, level `1`, JSON content
- `definition` -> repository object type `definition`, level `1`, value content
- `single-endpoint` -> repository object type `single-endpoint`, level `1`, JSON content

Repository IDs are returned to existing clients as `_id` (services/single endpoints) or `id` (definitions), keeping the existing frontend contract stable.

## Behaviour matched to the actual repository source

The repository implementation shows that:

- `POST /insert` returns a mutation result containing `upsertedId`, not the inserted object. The adapter now reads the object back after insert before returning it to Service Directory clients.
- `POST /search/{owner}` returns a JSON array directly. The adapter uses that concrete response shape rather than speculative response envelopes.
- `GET /get/{object_id}` is global by object ID and does not apply an owner filter. The adapter rejects objects whose `ownerId` is not the configured Service Directory owner.
- `DELETE /delete/{object_id}` is also global by object ID. The adapter performs the owner-checked read first, preventing Service Directory from deleting another repository owner's object.
- `POST /partial-update` includes `ownerId` in the repository update selector, so updates are owner-scoped by the repository itself.

## MongoDB removal

MongoDB/Mongoose runtime dependencies and module registrations have been removed. The existing `*.schema.ts` filenames are retained only to avoid unnecessary import churn; the exported classes are plain Swagger/API models and no longer define Mongoose schemas. Docker Compose no longer starts a Mongo database.

## Keycloak attribution

The shared owner decision is independent of Keycloak. A later hardening pass can populate `metadata.user`, `metadata.company`, and `metadata.organization` from the authenticated Keycloak principal instead of trusting/falling back to values supplied by the request body. This is useful for audit attribution but should not change `ownerId`.

## Validation and runtime configuration

The OpenAPI text validator is awaited before insert/update, preventing invalid definitions from being persisted before an asynchronous validation failure is observed. The listen port is configurable through `PORT` and defaults to `3002`.

The Nest TypeScript build passes. The existing controller test suite contains a test that makes a real network request to `service-api.orchestration-test.icelab.cloud` during OpenAPI validation; that test should be mocked so the suite does not depend on external DNS/network availability.

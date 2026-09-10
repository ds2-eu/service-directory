# Service Directory API

This is the back-end for the Service Directory, which replaced the WASP Marketplace that was a portlet in Liferay. It has a [corresponding front-end](https://git.icelab.cloud/wasp/service-directory).

Like the [Service API](https://git.icelab.cloud/wasp/service-api), this is in [Nest.js](https://nestjs.com/), written in [TypeScript](https://www.typescriptlang.org/), and compliant with [OpenAPI](https://www.openapis.org/) with a [Swagger](https://swagger.io/) user-interface. It is on ICE’s GitLab Docker registry and deployed on the [test server](https://service-directory-api.orchestration-test.icelab.cloud/api/) and [production server](https://service-directory-api.orchestration.icelab.cloud/api/).

Unlike the Service API, the Service Directory is the replacement for the old Marketplace, because it lists services (including the Service API) that can be called in Orchestration processes. Users are able to see/add/edit/delete their own services. Every service is OpenAPI-compliant also.

The Service Directory can also contain “single endpoints”. This is like a service but not OpenAPI-compliant, so the Service Directory may need to store the information about HTTP verbs and request/response schemata (etc) that would have been in the OpenAPI Yaml file. (It doesn’t yet.)

It can also contain “common definitions”, which are extracts of specification that can be included in multiple OpenAPI specifications.

For a list of validation rules on the services, see Issue [#8](https://git.icelab.cloud/wasp/service-directory-api/-/issues/8).

_For more documentation about specific modules and controllers, see the [/documentation](./documentation/architecture.md) folder._

## Notes on terminology

In the old Marketplace, OpenAPI services were called “external marketplaces” and single endpoints were called “services”. Both could be added into “categories”, and categories also could be nested in other categories. We don’t have the categories functionality in the Service Directory.

Files named “\*\*.service.ts” are used by Nest.js to keep business logic for controllers, and by Angular to keep business logic for modules. This results in us having files such as `src/service/service.service.ts` for classes such as `ServiceService`, which is a service that handles services in the Service Directory. Don’t get confused!

## Installation

```bash
$ npm install
```

Copy `.env.example` to `.env` for local development, then set the Objects Repository API key supplied for the repository deployment. A typical configuration is:

```
PORT=3002
SERVER=http://localhost:3002
SECURITY_ENABLED=false
AUTH_URL=http://localhost:8080
REALM=Orchestration
CLIENT_ID=service-directory-api
CLIENT_SECRET=yourSecretHere
REPOSITORY_API_URL=https://dlmstorebackend.idta.ds2.icelab.cloud/repository-api
REPOSITORY_OWNER_ID=service-directory
REPOSITORY_API_KEY=yourRepositoryApiKey
```

`REPOSITORY_OWNER_ID=service-directory` is intentionally shared by every Service Directory deployment that should participate in the same global catalogue. The repository API key belongs only on the backend; do not expose it in Angular/browser configuration.

The `SECURITY_ENABLED` variable determines whether to enable security through Keycloak.
This will cause 401 or 403 errors to be returned if a request is made without a valid header in the form `Authorization: Bearer yourValidAccessToken`.
If the variable is false (or not `true`), no authorization is required for any endpoint.

If Keycloak is to be used, you’ll need an instance of Keycloak with a realm and client for the Service Directory API.
The values of `AUTH_URL`, `REALM`, `CLIENT_ID`, and `CLIENT_SECRET` should come from Keycloak.

## Running without Docker

```bash
# Run in development without watching for file-changes
$ npm run start

# Run in development, rebuilding on file-changes
$ npm run start:dev

# Run in production
$ npm run start:prod
```

The Swagger interface will be at `http://localhost:${PORT:-3002}/api/` (normally http://localhost:3002/api/).

## Running in Docker

```bash
# Build from scratch
$ docker build . --no-cache

# Start
$ docker-compose up -d

# Stop
$ docker-compose down
```

The Swagger interface will be at http://localhost:2502/api/

## Deployment

Ensure you have Docker Desktop running.

Log into GitLab if you aren’t already logged in.

```bash
docker login git.icelab.cloud -u {YourGitLabUN} -p {YourGitLabPW}
```

Then, build the Docker image, with a tag, and upload it to the Docker registry on ICE’s GitLab server.

You can do this most easily with the publish.ps1 script that is in the root folder.
This will prompt you to choose a deployment (eg `4` for the Orchestration test server), then will build and upload the image for you.

It might be equivalent to:

```bash
docker build -t git.icelab.cloud/wasp/deployment/orchestration-test/service-directory-api:latest ./
docker image push git.icelab.cloud/wasp/deployment/orchestration-test/service-directory-api:latest
```

Once you have a new image on the GitLab server, refresh the entire Service Directory on the test server.
(Do this in a separate terminal. You’ll need a VPN connection and SSH credentials for the test server.)

```bash
ssh root@192.168.50.220
cd /opt/orchestration/service-directory
docker login git.icelab.cloud -u {YourGitLabUN} -p {YourGitLabPW}
docker-compose pull
docker-compose up -d
```

For the production server, the IP address is 192.168.50.221 but the commands are otherwise the same.

### Image maintenance

To save space, you may need to delete any obsolete images:

```bash
docker rmi $(docker images | grep 'service-directory')
```

(This actually tries to delete all images with names containing “service-directory”. It succeeds for unused images, but gives error-messages for images that are in use, which is fine.)

The `grep` command works on Linux, but not Windows.

### Confirmation of deployment

To see the list of running containers (which should include service-directory-api:latest):

```bash
docker ps
```

If you open https://service-directory-api.orchestration-test.icelab.cloud/api/ in a web browser, or http://192.168.50.220:2502/api/, you should see the Swagger interface. And https://orchestration-test.icelab.cloud/service-directory should show the front-end.

## Automated testing

```bash
# Unit tests
$ npm run test

# End-to-end tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

Unit tests are in .spec.ts files, whereas end-to-end tests are in the .e2e-spec.ts files in the /test folder.

The persistence-facing service classes are mocked by the existing `mockServiceService`, `mockDefinitionsService`, and `mockSingleEndpointService` test objects. Repository integration tests should mock HTTP calls to the Objects Repository rather than making live network requests.

As of writing this, all endpoints are covered by unit tests, and all endpoints (except those for managing “single endpoints”) are also covered by end-to-end tests.


## Objects Repository storage

Service Directory uses the shared ICE Objects Repository instead of a local MongoDB. All installations using the same repository should use the same owner namespace (`service-directory`) so they see one shared catalogue. Configure `REPOSITORY_API_URL`, `REPOSITORY_OWNER_ID`, and the server-side `REPOSITORY_API_KEY`; see `REPOSITORY_MIGRATION.md` for the confirmed mapping, validation notes, and security boundaries.

# Service Directory

## **Screenshots**

Screenshots for the Service Directory will be added to the `images`
directory.

## **Commercial Information**

  ----------------------------------------------------------------------------------------------
  Organisation (s)                         License Nature    License           Marketplace Link
  ---------------------------------------- ----------------- ----------------- -----------------
  [ICE](https://informationcatalyst.com)   Open Source       Apache 2.0        TODO

  ----------------------------------------------------------------------------------------------

## **Top Features**

1.  Register API services for use within DS2.
2.  Browse services available through the Service Directory.
3.  Store and retrieve Service Directory data using the DS2 Objects
    Repository.
4.  Make registered services available to orchestration components such
    as the Process Designer.
5.  Manage API definitions associated with registered services.
6.  Support DS2 authentication through the Dash Button.

## **How To Install**

### DS2 Installation

The Service Directory is deployed using the DS2 Helm infrastructure.

The Helm chart is located at:

`charts/service-directory`

The deployment consists of:

-   `servicedirectory` - Angular frontend
-   `servicedirectoryapi` - NestJS backend API

The backend uses the DS2 Objects Repository for Service Directory
persistence and does not require a dedicated MongoDB instance.

Configuration is supplied through the Helm `values.yaml` file.

### Configuration

#### Frontend

The standalone frontend requires:

-   `API_ENDPOINT` - URL of the Service Directory API.

The Dash Button provides the DS2 login integration independently of the
Orchestration Portal Header. The standalone Service Directory does not
require the Orchestration Config API in order to load a Portal Header.

#### Backend

The backend uses the following configuration:

-   `SECURITY_ENABLED` - Enables or disables authentication on the
    Service Directory API.
-   `AUTH_URL` - Keycloak authentication URL when backend security is
    enabled.
-   `REALM` - Keycloak realm when backend security is enabled.
-   `CLIENT_ID` - Keycloak client ID when backend security is enabled.
-   `CLIENT_SECRET` - Keycloak client secret when required by the
    configured Keycloak client.
-   `PORT` - Service Directory API port. The default local port is
    `3002`.
-   `SERVER` - Public Service Directory API URL.
-   `REPOSITORY_API_URL` - DS2 Objects Repository API endpoint.
-   `REPOSITORY_OWNER_ID` - Repository owner used for Service Directory
    objects.
-   `REPOSITORY_API_KEY` - Objects Repository API key.

Credentials and API keys must not be committed to the repository.

### Standalone Installation

#### Requirements

-   Git
-   Node.js
-   npm

Docker is also required if you want to build or run the container
images.

## **Running Locally**

For local development, run the backend and frontend in separate
terminals.

### 1. Configure and run the backend

From:

`service-directory/back-end`

Install dependencies:

``` powershell
npm ci
```

Create a local `.env` file using `.env.example` as the starting point.
For local development, the important settings are:

``` env
PORT=3002
SERVER=http://localhost:3002
SECURITY_ENABLED=false

REPOSITORY_API_URL=https://dlmstorebackend.idta.ds2.icelab.cloud/repository-api
REPOSITORY_OWNER_ID=service-directory
REPOSITORY_API_KEY=<repository-api-key>
```

Do not commit the `.env` file or the repository API key.

Start the API in development mode:

``` powershell
npm run start:dev
```

The Service Directory API will then be available at:

`http://localhost:3002`

### 2. Configure and run the frontend

The local frontend configuration is stored in:

`service-directory/front-end/src/config.json`

For local development it should point to the local API:

``` json
{
  "apiEndpoint": "http://localhost:3002"
}
```

From:

`service-directory/front-end`

install dependencies:

``` powershell
npm ci
```

Then start the Angular development server:

``` powershell
npm start
```

The frontend `start` script runs Angular on port `4203`, so open:

`http://localhost:4203`

The local request path is therefore:

``` text
Browser
  |
  | http://localhost:4203
  v
Service Directory frontend
  |
  | API endpoint: http://localhost:3002
  v
Service Directory API
  |
  | REPOSITORY_API_URL
  v
DS2 Objects Repository
```

### 3. Build both components

The repository also contains a root PowerShell build script in the
directory containing `front-end` and `back-end`.

Run:

``` powershell
.\build.ps1
```

Use the local option to build both components locally, or the DS2 option
to build and publish the DS2 container images.

## **How To Use**

The Service Directory allows API services to be registered and made
available for discovery by other DS2 components.

A user can add a service through the Service Directory interface by
supplying the service information and its OpenAPI information.

Registered services are persisted through the Objects Repository and can
be retrieved by other Service Directory instances connected to the same
repository catalogue.

At the current stage, the Service Directory provides service discovery:
a consuming application can retrieve registered service information and
its OpenAPI definition through the Service Directory API, then interact
with the registered service directly.

Service invocation through a gateway can be added separately; it is not
required for the current repository-backed discovery flow.

## **Objects Repository Integration**

The Service Directory backend provides an abstraction between the
existing Service Directory REST API and the DS2 Objects Repository.

The frontend communicates with the Service Directory API rather than
accessing the Objects Repository directly. Repository-specific
operations and credentials remain within the backend.

The Objects Repository stores Service Directory services, definitions
and single-endpoint records.

The repository endpoint is configured using `REPOSITORY_API_URL`.

The basic discovery path is:

``` text
Consuming application
        |
        | Service Directory REST API
        v
Service Directory API
        |
        | Objects Repository API
        v
Objects Repository
```

The repository stores catalogue information about a service; it does not
host or execute the registered service itself.

## **Other Information**

The Service Directory originated as a subcomponent of the DS2
Orchestration module. This repository packages the Service Directory
frontend and backend independently while retaining compatibility with
the wider orchestration environment where required.

The standalone frontend uses the DS2 Dash Button for login rather than
requiring the full Orchestration Portal Header.

## **OpenAPI Specification**

TODO

## **Video Link**

TODO

## **Additional Links**

-   DS2 Orchestration: <https://github.com/ds2-eu/orchestration>

## FAQ

TODO

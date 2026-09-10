# Service Directory

## **Screenshots**

Screenshots for the Service Directory will be added to the `images` directory.

## **Commercial Information**

| Organisation (s) | License Nature | License | Marketplace Link |
| ---------------- | -------------- | ------- | ---------------- |
| [ICE](https://informationcatalyst.com) | Open Source | Apache 2.0 | TODO |

## **Top Features**

1. Register API services for use within DS2.
2. Browse services available through the Service Directory.
3. Store and retrieve Service Directory data using the DS2 Objects Repository.
4. Make registered services available to orchestration components such as the Process Designer.
5. Manage API definitions associated with registered services.
6. Support authentication through the DS2/Keycloak environment.

## **How To Install**

### DS2 Installation

The Service Directory is deployed using the DS2 Helm infrastructure.

The Helm chart is located at:

`charts/service-directory`

The deployment consists of:

- `servicedirectory` - Angular frontend
- `servicedirectoryapi` - NestJS backend API

The backend uses the DS2 Objects Repository for Service Directory persistence and does not require a dedicated MongoDB instance.

Configuration is supplied through the Helm `values.yaml` file.

### Configuration

#### Frontend

The frontend uses the following configuration:

- `API_ENDPOINT` - Service Directory API endpoint
- `GATEWAY_ENDPOINT` - Orchestration gateway endpoint
- `CONFIG_ENDPOINT` - DS2 configuration API endpoint

#### Backend

The backend uses the following configuration:

- `SECURITY_ENABLED` - Enables or disables authentication
- `AUTH_URL` - Keycloak authentication URL
- `REALM` - Keycloak realm
- `CLIENT_ID` - Keycloak client ID
- `CLIENT_SECRET` - Keycloak client secret
- `PORT` - Service Directory API port
- `SERVER` - Public Service Directory API URL
- `REPOSITORY_API_URL` - DS2 Objects Repository API endpoint
- `REPOSITORY_OWNER_ID` - Repository owner used for Service Directory objects
- `REPOSITORY_API_KEY` - Objects Repository API key

Credentials and API keys must not be committed to the repository.

### Standalone Installation

#### Requirements

- Git
- Node.js
- npm

#### Backend

From the backend directory:

`service-directory/back-end`

Install dependencies:

```bash
npm ci
```

Build the application:

```bash
npm run build
```

Configure the required environment variables using `.env.example` as a reference.

Start the backend using the appropriate npm start command for the environment.

#### Frontend

From the frontend directory:

`service-directory/front-end`

Install dependencies:

```bash
npm ci
```

Build the application:

```bash
npm run build
```

The frontend must be configured with the URL of the running Service Directory API.

## **How To Use**

The Service Directory allows API services to be registered and made available to other DS2 orchestration components.

A user can add a service through the Service Directory interface by supplying the service information and its OpenAPI information.

Registered services are persisted through the Objects Repository and can be retrieved by other Service Directory instances connected to the same repository catalogue.

Services registered in the directory can subsequently be used by orchestration components such as the Process Designer.

## **Objects Repository Integration**

The Service Directory backend provides an abstraction between the existing Service Directory REST API and the DS2 Objects Repository.

The frontend continues to communicate with the Service Directory API. Repository-specific operations and credentials remain within the backend.

The Objects Repository stores Service Directory services, definitions and single-endpoint records.

The repository endpoint is configured using `REPOSITORY_API_URL`.

## **Other Information**

The Service Directory originated as a subcomponent of the DS2 Orchestration module. This repository packages the Service Directory frontend and backend independently while retaining integration with the wider orchestration environment.

## **OpenAPI Specification**

TODO

## **Video Link**

TODO

## **Additional Links**

- DS2 Orchestration: <https://github.com/ds2-eu/orchestration>

## FAQ

TODO
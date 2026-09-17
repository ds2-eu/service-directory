[1mdiff --git a/docs/README.md b/docs/README.md[m
[1mindex 78c26d4..2a4d3ec 100644[m
[1m--- a/docs/README.md[m
[1m+++ b/docs/README.md[m
[36m@@ -1,296 +1,156 @@[m
[31m-\# Service Directory[m
[31m-[m
[31m-[m
[31m-[m
[31m-\## \*\*Screenshots\*\*[m
[31m-[m
[32m+[m[32m# Service Directory[m
 [m
[32m+[m[32m## **Screenshots**[m
 [m
 Screenshots for the Service Directory will be added to the `images` directory.[m
 [m
[31m-[m
[31m-[m
[31m-\## \*\*Commercial Information\*\*[m
[31m-[m
[31m-[m
[32m+[m[32m## **Commercial Information**[m
 [m
 | Organisation (s) | License Nature | License | Marketplace Link |[m
[31m-[m
 | ---------------- | -------------- | ------- | ---------------- |[m
[32m+[m[32m| [ICE](https://informationcatalyst.com) | Open Source | Apache 2.0 | TODO |[m
 [m
[31m-| ICE | Open Source | Apache 2.0 | TODO |[m
[31m-[m
[31m-[m
[31m-[m
[31m-\## \*\*Top Features\*\*[m
[31m-[m
[31m-[m
[31m-[m
[31m-1\. Register API services for use within DS2.[m
[31m-[m
[31m-2\. Browse services available through the Service Directory.[m
[31m-[m
[31m-3\. Store and retrieve Service Directory data using the DS2 Objects Repository.[m
[31m-[m
[31m-4\. Make registered services available to orchestration components such as the Process Designer.[m
[31m-[m
[31m-5\. Manage API definitions associated with registered services.[m
[32m+[m[32m## **Top Features**[m
 [m
[31m-6\. Support authentication through the DS2/Keycloak environment.[m
[31m-[m
[31m-[m
[31m-[m
[31m-\## \*\*How To Install\*\*[m
[31m-[m
[31m-[m
[31m-[m
[31m-\### DS2 Installation[m
[32m+[m[32m1. Register API services for use within DS2.[m
[32m+[m[32m2. Browse services available through the Service Directory.[m
[32m+[m[32m3. Store and retrieve Service Directory data using the DS2 Objects Repository.[m
[32m+[m[32m4. Make registered services available to orchestration components such as the Process Designer.[m
[32m+[m[32m5. Manage API definitions associated with registered services.[m
[32m+[m[32m6. Support authentication through the DS2/Keycloak environment.[m
 [m
[32m+[m[32m## **How To Install**[m
 [m
[32m+[m[32m### DS2 Installation[m
 [m
 The Service Directory is deployed using the DS2 Helm infrastructure.[m
 [m
[31m-[m
[31m-[m
 The Helm chart is located at:[m
 [m
[31m-[m
[31m-[m
 `charts/service-directory`[m
 [m
[31m-[m
[31m-[m
 The deployment consists of:[m
 [m
[31m-[m
[31m-[m
[31m-\- `servicedirectory` - Angular frontend[m
[31m-[m
[31m-\- `servicedirectoryapi` - NestJS backend API[m
[31m-[m
[31m-[m
[32m+[m[32m- `servicedirectory` - Angular frontend[m
[32m+[m[32m- `servicedirectoryapi` - NestJS backend API[m
 [m
 The backend uses the DS2 Objects Repository for Service Directory persistence and does not require a dedicated MongoDB instance.[m
 [m
[31m-[m
[31m-[m
 Configuration is supplied through the Helm `values.yaml` file.[m
 [m
[32m+[m[32m### Configuration[m
 [m
[31m-[m
[31m-\### Configuration[m
[31m-[m
[31m-[m
[31m-[m
[31m-\#### Frontend[m
[31m-[m
[31m-[m
[32m+[m[32m#### Frontend[m
 [m
 The frontend uses the following configuration:[m
 [m
[32m+[m[32m- `API_ENDPOINT` - Service Directory API endpoint[m
[32m+[m[32m- `GATEWAY_ENDPOINT` - Orchestration gateway endpoint[m
[32m+[m[32m- `CONFIG_ENDPOINT` - DS2 configuration API endpoint[m
 [m
[31m-[m
[31m-\- `API\_ENDPOINT` - Service Directory API endpoint[m
[31m-[m
[31m-\- `GATEWAY\_ENDPOINT` - Orchestration gateway endpoint[m
[31m-[m
[31m-\- `CONFIG\_ENDPOINT` - DS2 configuration API endpoint[m
[31m-[m
[31m-[m
[31m-[m
[31m-\#### Backend[m
[31m-[m
[31m-[m
[32m+[m[32m#### Backend[m
 [m
 The backend uses the following configuration:[m
 [m
[31m-[m
[31m-[m
[31m-\- `SECURITY\_ENABLED` - Enables or disables authentication[m
[31m-[m
[31m-\- `AUTH\_URL` - Keycloak authentication URL[m
[31m-[m
[31m-\- `REALM` - Keycloak realm[m
[31m-[m
[31m-\- `CLIENT\_ID` - Keycloak client ID[m
[31m-[m
[31m-\- `CLIENT\_SECRET` - Keycloak client secret[m
[31m-[m
[31m-\- `PORT` - Service Directory API port[m
[31m-[m
[31m-\- `SERVER` - Public Service Directory API URL[m
[31m-[m
[31m-\- `REPOSITORY\_API\_URL` - DS2 Objects Repository API endpoint[m
[31m-[m
[31m-\- `REPOSITORY\_OWNER\_ID` - Repository owner used for Service Directory objects[m
[31m-[m
[31m-\- `REPOSITORY\_API\_KEY` - Objects Repository API key[m
[31m-[m
[31m-[m
[32m+[m[32m- `SECURITY_ENABLED` - Enables or disables authentication[m
[32m+[m[32m- `AUTH_URL` - Keycloak authentication URL[m
[32m+[m[32m- `REALM` - Keycloak realm[m
[32m+[m[32m- `CLIENT_ID` - Keycloak client ID[m
[32m+[m[32m- `CLIENT_SECRET` - Keycloak client secret[m
[32m+[m[32m- `PORT` - Service Directory API port[m
[32m+[m[32m- `SERVER` - Public Service Directory API URL[m
[32m+[m[32m- `REPOSITORY_API_URL` - DS2 Objects Repository API endpoint[m
[32m+[m[32m- `REPOSITORY_OWNER_ID` - Repository owner used for Service Directory objects[m
[32m+[m[32m- `REPOSITORY_API_KEY` - Objects Repository API key[m
 [m
 Credentials and API keys must not be committed to the repository.[m
 [m
[32m+[m[32m### Standalone Installation[m
 [m
[32m+[m[32m#### Requirements[m
 [m
[31m-\### Standalone Installation[m
[31m-[m
[31m-[m
[31m-[m
[31m-\#### Requirements[m
[31m-[m
[31m-[m
[31m-[m
[31m-\- Git[m
[31m-[m
[31m-\- Node.js[m
[31m-[m
[31m-\- npm[m
[31m-[m
[31m-[m
[31m-[m
[31m-\#### Backend[m
[31m-[m
[32m+[m[32m- Git[m
[32m+[m[32m- Node.js[m
[32m+[m[32m- npm[m
 [m
[32m+[m[32m#### Backend[m
 [m
 From the backend directory:[m
 [m
[31m-[m
[31m-[m
 `service-directory/back-end`[m
 [m
[31m-[m
[31m-[m
 Install dependencies:[m
 [m
[31m-[m
[31m-[m
[31m-&#x20;   npm ci[m
[31m-[m
[31m-[m
[32m+[m[32m```bash[m
[32m+[m[32mnpm ci[m
[32m+[m[32m```[m
 [m
 Build the application:[m
 [m
[31m-[m
[31m-[m
[31m-&#x20;   npm run build[m
[31m-[m
[31m-[m
[32m+[m[32m```bash[m
[32m+[m[32mnpm run build[m
[32m+[m[32m```[m
 [m
 Configure the required environment variables using `.env.example` as a reference.[m
 [m
[31m-[m
[31m-[m
 Start the backend using the appropriate npm start command for the environment.[m
 [m
[31m-[m
[31m-[m
[31m-\#### Frontend[m
[31m-[m
[31m-[m
[32m+[m[32m#### Frontend[m
 [m
 From the frontend directory:[m
 [m
[31m-[m
[31m-[m
 `service-directory/front-end`[m
 [m
[31m-[m
[31m-[m
 Install dependencies:[m
 [m
[31m-[m
[31m-[m
[31m-&#x20;   npm ci[m
[31m-[m
[31m-[m
[32m+[m[32m```bash[m
[32m+[m[32mnpm ci[m
[32m+[m[32m```[m
 [m
 Build the application:[m
 [m
[31m-[m
[31m-[m
[31m-&#x20;   npm run build[m
[31m-[m
[31m-[m
[32m+[m[32m```bash[m
[32m+[m[32mnpm run build[m
[32m+[m[32m```[m
 [m
 The frontend must be configured with the URL of the running Service Directory API.[m
 [m
[31m-[m
[31m-[m
[31m-\## \*\*How To Use\*\*[m
[31m-[m
[31m-[m
[32m+[m[32m## **How To Use**[m
 [m
 The Service Directory allows API services to be registered and made available to other DS2 orchestration components.[m
 [m
[31m-[m
[31m-[m
 A user can add a service through the Service Directory interface by supplying the service information and its OpenAPI information.[m
 [m
[31m-[m
[31m-[m
 Registered services are persisted through the Objects Repository and can be retrieved by other Service Directory instances connected to the same repository catalogue.[m
 [m
[31m-[m
[31m-[m
 Services registered in the directory can subsequently be used by orchestration components such as the Process Designer.[m
 [m
[31m-[m
[31m-[m
[31m-\## \*\*Objects Repository Integration\*\*[m
[31m-[m
[31m-[m
[32m+[m[32m## **Objects Repository Integration**[m
 [m
 The Service Directory backend provides an abstraction between the existing Service Directory REST API and the DS2 Objects Repository.[m
 [m
[31m-[m
[31m-[m
 The frontend continues to communicate with the Service Directory API. Repository-specific operations and credentials remain within the backend.[m
 [m
[31m-[m
[31m-[m
 The Objects Repository stores Service Directory services, definitions and single-endpoint records.[m
 [m
[32m+[m[32mThe repository endpoint is configured using `REPOSITORY_API_URL`.[m
 [m
[31m-[m
[31m-The repository endpoint is configured using `REPOSITORY\_API\_URL`.[m
[31m-[m
[31m-[m
[31m-[m
[31m-\## \*\*Other Information\*\*[m
[31m-[m
[31m-[m
[32m+[m[32m## **Other Information**[m
 [m
 The Service Directory originated as a subcomponent of the DS2 Orchestration module. This repository packages the Service Directory frontend and backend independently while retaining integration with the wider orchestration environment.[m
 [m
[31m-[m
[31m-[m
[31m-\## \*\*OpenAPI Specification\*\*[m
[31m-[m
[31m-[m
[32m+[m[32m## **OpenAPI Specification**[m
 [m
 TODO[m
 [m
[31m-[m
[31m-[m
[31m-\## \*\*Video Link\*\*[m
[31m-[m
[31m-[m
[32m+[m[32m## **Video Link**[m
 [m
 TODO[m
 [m
[32m+[m[32m## **Additional Links**[m
 [m
[32m+[m[32m- DS2 Orchestration: <https://github.com/ds2-eu/orchestration>[m
 [m
[31m-\## \*\*Additional Links\*\*[m
[31m-[m
[31m-[m
[31m-[m
[31m-\- DS2 Orchestration: https://github.com/ds2-eu/orchestration[m
[31m-[m
[31m-[m
[31m-[m
[31m-\## FAQ[m
[31m-[m
[31m-[m
[31m-[m
[31m-TODO[m
[32m+[m[32m## FAQ[m
 [m
[32m+[m[32mTODO[m
\ No newline at end of file[m

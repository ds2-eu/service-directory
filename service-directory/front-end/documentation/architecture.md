# Service Directory UI — Architecture

The Service Directory UI is a module from ICE Orchestration.
It’s a web application developed using the [Angular framework](https://angular.io).

Its purpose is to be a front-end to the Service Directory API and (to a lesser extent) the API Gateway.
Services (external APIs described by OpenAPI) can be added to the Service Directory, and services that are in the Service Directory can be used in BPMN processes via the Process Designer.

Each service must be described by a OpenAPI specification, which can be supplied either via a URL or saved directly on the service in the Service Directory.
OpenAPI specs can include “common definitions”, which are fragments of OpenAPI spec that can be reused across multiple specifications.

Services that require authentication can have this information saved as a “security definition”.

## Libraries used in the Service Directory UI

- Angular, core framework
- NgRx, library used to handle internal messages using Redux pattern
- Font Awesome, this is a common library for displaying icons
- Bootstrap, all ICE Orchestration modules use 4.X version or later
- Keycloak, for Keycloak integration, although all the authentication is handled by the shared Angular library, ICE Orchestration Portal Header

## Service Directory UI and Redux pattern

The Service Directory UI uses internally the NgRx library for implementing the [Redux pattern](https://redux.js.org/tutorials/fundamentals/part-1-overview).

This pattern is useful for communication between different components, using actions and effects. For example you can launch an action from component A, then an effect changes the application state, the component B is updated because of this application state change.

## Service Directory UI modules

The Service Directory UI leverages Angular modules, and each of its functionalities is grouped under its corresponding module.

`AppModule` (src/app/app-module.ts) is the base module for the entire Angular application.
All the Service Directory’s front-end routes are specified in `AppRoutingModule` (src/app/app-routing.module.ts).

Other modules are separated into subfolders of /src/app.

- [/core](./core.md) (Angular services used across the application)
- [/definitions](./definitions.md) (common definitions)
- [/gateway](./gateway.md) (security definitions)
- [/services](./services.md) (records of external APIs)
- [/shared](./shared.md) (Angular components shared between modules)

## ICE Orchestration Portal Header

This is an Angular component imported as an NPM library.
It is a header used on all ICE Orchestration front-ends, for shared navigation, user-management, and branding (product title and logo).

The Portal Header is used directly `AppModule`, which is responsible for:

- deciding whether to show the Portal Header;
- passing data into the Portal Header about what Orchestration modules to provide navigation links for (including the Service Directory UI itself);
- listening for the Angular event that the Portal Header raises when the user logs in;
- deciding what Angular components to show below the header.

The header is shown if the configuration variable `portalConfig.usePortal` is truthy.
So the Portal Header is visible in production but may be hidden in development.

The list of front-ends is `portalConfig.modules`.

`portalConfig` variables come from the Orchestration Config API, unless the Service Directory UI is not configured with a URL for that API.
This is explained more in [core.md](./core.md).

If the Portal Header is shown but no user is logged in, `AppModule` hides all Service Directory UI content.
The content is revealed when the user logs into Orchestration via the Portal Header, thanks to the Angular event that is raised.

If the Portal Header is not shown, Service Directory UI content is always shown.
This may be the case in development, depending on local configuration.

## Tests

See [tests documentation](./tests.md).

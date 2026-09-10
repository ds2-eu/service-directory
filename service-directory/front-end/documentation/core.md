# Service Directory UI — `CoreModule`

`CoreModule` contains core Angular services used throughout the application.

## `ConfigService`

This provides configuration values for the application.

It reads from a config.json file and calls the ICE Orchestration Config API (if its endpoint is defined in config.json).
The Config API returns a configuration object for the Portal Header (including Keycloak); this is combined with the values in config.json to produce the final configuration object.

The configuration object can be accessed as `configService.config`.

### Config for development and production

In development, config.json does not reference the Config API — the Portal Header is not shown and Keycloak is not used.

When the application is deployed, the config.json.src file is used to create the config.json file, using values from the deployment’s docker-compose.yml file.
This includes the URL for the Config API, allowing for full integration with the Portal Header and Keycloak.

## `DefinitionsService`

This uses Angular’s HTTP client to make requests to the Service Directory API related to common definitions.
This is how the application…

- gets the full list of common definitions,
- gets the information for one common definition (specified by its ID),
- creates a common definition from a name and value,
- updates the name and value of a common definition (specified by its ID),
- deletes a common definition (specified by its ID).

## `GlobalErrorHandler`

Toastr is a dependency that is used for displaying “toast” messages in the top-right corner of the viewport.
`GlobalErrorHandler` is a wrapper for it, but it is only used for error-messages that are not displayed in a particular component.

For example, if a component displays information for an OpenAPI service, and the service doesn’t exist, the component might simply say, “The service was not found.”
But for unexpected errors, `GlobalErrorHandler` is a necessary fallback.

The code below in `CoreModule` is what tells Angular to use the handler whenever there’s an error that wouldn’t otherwise be handled.

```ts
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
```

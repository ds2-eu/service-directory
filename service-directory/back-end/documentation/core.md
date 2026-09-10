# Service Directory API — `CoreModule`

`CoreModule` contains code that is used across modules in the Service Directory API.
It therefore includes the exception filter, the logging interceptor, and some utility functions.
These are organized in subfolders.

## `HttpExceptionFilter`

This filter catches any HTTP exception (an exception with an associated HTTP status-code such as 404).

It logs the exception (and information about the request) using Nest.js’s built-in logger, with an additional log if the status-code was not on a list of expected status-codes.
The logging interceptor (see below) does not log exceptions, hence the logging in `HttpExceptionFilter`.

The response is then a Json object such as `{"error":"Cannot GET /nonsense","statusCode":404,"success":false}`.

There is some special handling for some exceptions coming from Mongoose.

If a request is made for a service or single endpoint specified by an ID, but the ID is not plausible as a MongoDB ID (ie, not a 24-character hexadecimal string), Mongoose throws an exception with the message <samp>Cast to ObjectId failed for value "nonsense" (type string) at path "\_id" for model "Service"</samp>.
The HTTP exception filter rewrites this message to something a little more readable, for services and single endpoints.

Other Nest.js applications in Orchestration have a similar filter.

## `LoggingInterceptor`

A Nest.js interceptor has a method named `intercept` that receives:

- the request’s execution context, and
- a `next` “call handler” for running the route-handling for the request.

Code in `intercept` before `next.handle()` will be run before the controller receives the request.
Code inside `pipe()` on the return value of `next.handle()` will be run after the controller has processed the request.

In the Service Directory API, the one interceptor does logging.

Before the route-handling, it logs the following data:

- the HTTP method (verb);
- the endpoint URL;
- the user-agent (browser making the request);
- the client’s IP address;
- the name of the controller (class) that will be used for the request (eg `ServiceController`);
- the name of the function in the controller that will be called (eg `findAll`)

After the route-handling, it logs the following data:

- the HTTP method (verb);
- the endpoint URL;
- the HTTP status-code;
- the length of the response in bytes;
- the user-agent (browser making the request);
- the client’s IP address;
- the duration of the route-handling in milliseconds;
- the response returned by the route-handling.

Other Nest.js applications in Orchestration have a similar interceptor.

## Utility methods

The /src/core/utils folder contains several utility functions, each in a separate file.

They are all imported in the index.ts file in that folder, for re-export to other classes in the application.
(This is called a “barrel” — a file like index.ts that only exists to make imports simpler by allowing functions/classes from multiple files to be imported from the one file.)

Unit tests for the utility functions are in one file, index.spec.ts.

The utility methods are as follows.
They are all synchronous, except for `doesReturnOpenApiSpec` and `validateOpenApiDefinition` which return Promises.

### `changeNullPropertiesToEmptyString`

Bugs can be caused by trying to store null for a string property of an object in the database.
The `changeNullPropertiesToEmptyString` function simply returns a copy of the object that was passed into the function, but with instances of null replaced with the empty string (`""`).

### `doesReturnOpenApiSpec`

The `doesReturnOpenApiSpec` function is asynchronous.
It takes a URL as a parameter, makes a HTTP request to it, then makes a judgement about whether the response is an OpenAPI specification or not.
It returns true or false.

An OpenAPI spec, according to this function, either has a HTTP content-type of Yaml and includes the string `"openapi:"` (indicating that it contains an OpenAPI object), or can be parsed as Json and has an `openapi` property.

For more rigorous validation of OpenAPI specs, use `validateOpenApiDefinition`.

### `isNullOrWhiteSpace`

The `isNullOrWhiteSpace` function returns true for null or a string of zero or more whitespace characters.
It returns false for any string that contains non-whitespace characters.

This is used in the validation of common definitions, where names and values cannot be null or whitespace.

### `isValidUrl`

The `isValidUrl` function receives a string, which it attempts to parse as a URL using JavaScript’s built-in `URL` constructor.
It returns true if this is successful and the URL begins with “http://” or “https://”.
If the string is not a URL or is not the correct protocol, it returns false.

This is useful in validating the properties of services and single endpoints that are expected to be URLs.

### `removeNonJsonProperties`

The `removeNonJsonProperties` function receives an object (or an array of objects) and removes any properties that cannot be expressed in Json.
This is used when logging, because the built-in Nest.js logger can only accept messages expressed in Json.
(The logger throws exceptions otherwise, which do not get caught by `HttpExceptionHandler`.)

HTTP responses sent from the API should all be valid Json objects (or arrays of objects) anyway, but `removeNonJsonProperties` is useful in case a non-Json value (such as a `Map`, `Set`, or `undefined`) is accidentally included in an object.

Other Nest.js applications in Orchestration have a similar `removeNonJsonProperties` function.

### `validateOpenApiDefinition`

The `validateOpenApiDefinition` function is asynchronous.
It receives a string, and throws a HTTP exception (status-code 400) if the string cannot be parsed as a valid OpenAPI specification.

It uses two libraries:

- js-yaml, to check the input is valid Yaml;
- Swagger parser, to check the input is a valid OpenAPI spec (after it has been deemed valid Yaml).

If either of those two checks fails, the function throws an exception with the message “OpenAPI definition not valid”.
If OpenAPI spec was valid, the function returns `undefined`.

The `validateOpenApiDefinition` function is used when a service is defined with an OpenAPI spec to be saved directly in the Service Directory.
If the OpenAPI spec is defined via an endpoint, the `doesReturnOpenApiSpec` function is used instead, which attempts to validate the specification less stringently.

# Service Directory API — Tests

The Service Directory API has unit tests and end-to-end tests.
These use Nest.js’s built-in testing framework, Jest.

Nest.js services are not tested themselves: they are mostly simple wrappers for Mongoose.
They are mocked in all the tests for controllers.

As of writing this, all tests pass.

## Unit tests in the Service Directory API

All Nest.js controllers for the Service Directory have unit tests for all their methods.
Each unit test covers whether a call to a particular controller-method with a particular input or request-body returns the expected response-body.
Unit tests also check whether controller-methods call specific service-methods (eg `DefinitionsController.create` should call `DefinitionsService.create`).

Unit tests are in a .spec.ts file inside each Nest.js module.

To run unit tests, `npm test` is the command.

## End-to-end tests in the Service Directory API

All the endpoints in the Service Directory API (except endpoints for working with “single endpoints”) have end-to-end tests.
These simulate a HTTP request to a given URL with a given verb and request-body, and check that the returned status-code is correct.
For requests that should return 200 or 201, the end-to-end tests also check that the response-body is as expected.

All end-to-end tests are in /test folder, organized into files by module name.
(For example, the app.e2e-spec.ts file has end-to-end tests for `AppModule`.)

To run end-to-end tests, `npm run test:e2e` is the command.

## Test coverage in the Service Directory API

To check which files in the API are covered by tests, `npm run test:cov` is the command.
It should reveal that all controllers and DTOs (and most of the utility methods) are covered.

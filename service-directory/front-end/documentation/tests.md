# Service Directory UI — Tests

The UI has unit tests, run by `npm test`.
These use Angular’s built-in testing framework, based around Jasmine and Karma.

However, Angular by default opens a Google Chrome window with a UI for displaying the failing tests.
This doesn’t happen for the Service Directory UI.
Instead, the tests run in Puppeteer, which enables the tests to run in the console only, without a browser UI.
This is because it is important that the tests can be run in a CI/CD pipeline.

All Angular components for the Service Directory have unit tests.
The tests generally cover:

- whether the component is created,
- whether it can load data,
- the contents of the DOM during and after loading,
- what methods in the components are attached to what DOM controls.

(Some of these may not be applicable to some components.
For instance, the modal components do not load data: their data are passed in as props.)

As of writing this, all tests pass.

Angular services do not have unit tests: they are mostly simple wrappers for Angular’s HTTP request service, making calls to the Service Directory API or Process Engine Gateway API.
They are mocked in the tests for components.

Built-in Angular facilities such as the routing service are also mocked in the tests.
They are mocked with “stubs”, which are located in the /core/testing/basic-stubs-for-tests.ts file.
This file also contains mock values for OpenAPI services, security definitions, etc, which are used when mocking Angular services.

## Example test

Here’s an example of an Angular service being mocked.
We use Angular’s dependency framework to get the service (`DefinitionsService` here), then we use Jasmine’s `spyOn` method to replace one of the service’s methods (`getDefinitionById`) with a simple function that returns an observable that produces some mock data (`fakeDefinition`) after a number of simulated milliseconds (`2000`).

```ts
const definitionsService =
  fixture.debugElement.injector.get(DefinitionsService);
spyOn(definitionsService, 'getDefinitionById').and.callFake(() => {
  return of(fakeDefinition).pipe(delay(2000));
});
```

To simulate the passage of time, we call the `tick()` function with a number of milliseconds.
To prompt Angular to refresh the DOM, we call `fixture.detectChanges()`.
And to actually test anything, we use Jasmine’s `expect` functions.

So if the (mocked) service returns data after 2000 milliseconds, the component should say it’s loading after 1000 milliseconds, then not be loading after a further 1000 milliseconds.

```ts
tick(1000);
fixture.detectChanges();
expect(component.loading).toEqual(true);

tick(1000);
fixture.detectChanges();
expect(component.loading).toEqual(false);
```

For time to be simulated correctly, tests should be wrapped in `testAsync()`.

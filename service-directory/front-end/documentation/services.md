# Service Directory UI — `ServicesModule`

This is the module that deals with the services that the Service Directory exists for.
These are external APIs that are described by OpenAPI specifications — or rather, they are the records of such APIs that allow the APIs to be used in ICE Orchestration.

The module also contains `FourOFourPageComponent` and `HomepageComponent`, which are not specific to services.

## `FourOFourPageComponent`

This is the 404 page, shown when no routes for other Angular components match the current route.
It says no page was found, and has a link to the Service Directory homepage.

When this component is displayed, there will be no other components visible on the page (except the `AppComponent` which wraps everything and the Portal Header if that’s displayed).

## `HomepageComponent`

This is an Angular component which (despite its name) wraps every component in the application other than itself, the 404 page, the ICE Orchestration Portal Header, and the base `AppComponent`.

It gives every page (other than the 404 page) a header consisting of the following:

- a page title as a top-level heading, which is kept in sync with the `<title>` element using Angular’s built-in `Title` service.
- a pair of links, going to the pages that list the Service Directory’s services (the homepage) and common definitions.
- a horizontal rule (`<hr>` element) to give some separation between the header and the content below it.

The title should always begin with “Service Directory”; if there’s more to the title, a dash separates it, eg “Service Directory — Edit service”.

The homepage of the application has the URL of /services and the root URL (/) redirects to that.
It shows the list of services, `ServicesListComponent`.

## `ServicesListComponent`

This is the list of services in the Service Directory.
It appears on the homepage (/services) and on the “details” page for each service (/services/details/{service_id}).

It also has a link to “Add a service”.

On the homepage, no particular service is highlighted and there’s no pane on the right-hand side (`ServiceDetailsComponent`) giving details about a service.

But the list of services links to the details page for each service.
This page looks the same as the homepage, except the relevant service is highlighted in `ServicesListComponent` (it’s not a link and it has a background colour) and `ServiceDetailsComponent` appears with the relevant details.

If there are no services in the directory, the component says so.
The “Add a service” control still appears.

While the information is loading, or if an error has occurred in loading, the component says so, without the “Add a service” control.

`DefinitionListComponent` is a similar component, but for common definitions, and linking directly to an edit form instead of a “details” page.

## `ServiceDetailsComponent`

This appears on the details page for a service, next to the list of services (or under it on narrower screens).

The component uses the service’s ID in the URL to decide what service to display.
If no service matches the ID, the component says the service doesn’t exist and links back to the homepage.

While the information is loading, or if an error has occurred in loading, the component says so, without the “Add a service” control.

But if the service does exist and has loaded successfully, the component provides controls to edit the service (“Edit”), edit the security definition for the service (“Authentication”), delete the service (“Delete”), or go back to the homepage (“Close details”).

It also displays the following properties of the service (as a HTML description list, `<dl>`).

- the name,
- the description,
- the URL for the OpenAPI specification (displayed as a link),
- the URL for the Swagger UI (also displayed as a link),
- the type of authentication.

If any of these are missing, the component says so.
This is not necessarily a mistake — some properties are optional.

`ServiceDetailsComponent` doesn’t display the OpenAPI specification itself, even if it is defined directly on the service (ie, not through a URL).

## `ServiceEditPageComponent`

This component has a form for editing an existing service or creating a new one.

This component is shown on the “edit” page for a service, which the “Edit” link in `ServiceDetailsComponent` goes to.
The URL for this is /services/edit/{service_id}

The component is also shown on /services/edit which is the page for creating a service.
The “Add a service” link in `ServicesListComponent` goes to this page.

If the component is for editing a service, the page-title is “Service Directory — Edit service” and the form contains the service’s information.
If the component is for creating a service, the page-title is “Service Directory — Create service” and the form is blank (apart from the “Has OpenAPI endpoint” checkbox, which is ticked by default).

If the URL contains a service ID but it does not match a service, the ID is ignored and the component acts as a “Create service” form.
The page-title is simply “Service Directory”.

There are text inputs for the service’s name (required) and description (optional).
Then there are checkboxes for whether the service should be “hidden from Orchestration” (meaning it’s in the Service Directory but not visible in the Process Designer) and whether the service has an OpenAPI endpoint.

If “Has OpenAPI endpoint” is ticked (as is the default), two more text inputs are displayed.
One is for the OpenAPI endpoint — this is a URL for an online Yaml file that describes the service in OpenAPI format.
The other is intended for a URL for the Swagger user-interface for the API; this field is optional because an API might not be documented in Swagger (even if it is described with OpenAPI).

(A Swagger UI allows the OpenAPI specification to be presented in a more human-friendly format than the raw Yaml.
It is also an interface for making unauthenticated requests to the API.)

If “Has OpenAPI endpoint” is unticked, the two inputs for URLs are replaced by one textarea that the OpenAPI spec should be entered directly into, as raw Yaml.

The service’s OpenAPI spec (whether supplied directly or via an endpoint) is what the Process Designer will read when adding a BPMN service-task to an Orchestration process, in order for it to know what endpoints are available to be called in the service-task.
It is a required feature of a Service Directory service, and must be in Yaml format.

(To be clear, Json is technically a subformat of Yaml, so the spec may be Json or a non-Json form of Yaml.)

At the end of the form are these controls:

- “Save”, to create or update the service with the information in the form, and navigate to the service’s details page;
- “Authentication”, to go to a page for editing the service’s security definition (but see below);
- “Cancel”, to navigate to the service’s details page without saving the form.

If the form has unsaved changes, the “Authentication” control will open `ServicePageChangeModalComponent` instead of navigating.
The “Authentication” control is not shown at all if the form is for creating a service — to create an authenticated service, the user must create the service first, then create a security definition for it.

If a user has made a mistake in filling in the form, a warning message may be shown below the relevant field, or below the entire form.

## `ServicePageChangeModalComponent`

This component uses Angular’s modal facility to display a pop-up modal.
It is opened by `ServiceEditPageComponent` when the user makes changes to an existing service and clicks that component’s “Authentication” control without saving their edits first.

The modal says the user has unsaved changes, and invites them to:

- “Save and go to Authentication”, which saves their changes to the service, closes the modal, and navigates to `SecurityEditPageComponent`;
- “Continue editing”, which simply closes the modal so the user can resume editing the service in `ServiceEditPageComponent`.

The modal has a “close” icon in the top-right corner.
Behind the modal is a semi-transparent black overlay that covers the page, to make the modal more prominent while still keeping the “Edit service” form partly visible.
Both the “close” icon and the overlay close the modal when clicked, like the “Continue editing” button.

The page behind the modal cannot be scrolled or otherwise interacted with, until the modal is closed.
(This is what makes it a modal.)

## `ServiceDeleteModalComponent`

This is another component that uses Angular’s modal facility, like `ServicePageChangeModalComponent`.
It is opened by the “Delete” button on `ServiceDetailsComponent`.

It asks the user for confirmation that a service should be deleted from the Service Directory.
There is a “Delete” button, which deletes the service, closes the modal, and navigates to the homepage.

Like the other modal components in the Service Directory UI, it has a “close” icon in the top-right corner and a semi-transparent black overlay behind the modal.
These close the modal without deleting the service or doing any navigation.

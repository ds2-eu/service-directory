# Service Directory UI — `GatewayModule`

This is the module that deals with security definitions.
These are the details about the authentication that may be required to call specific services in the Service Directory.

Unlike other modules in the Service Directory UI, the gateway module calls the Orchestration Process Engine Gateway API (also known as the API Gateway), not the Service Directory API.

## `SecurityListComponent`

This component appears on the /gateway page, which is not linked to from any other page, so it’s not visible unless the visitor deliberately navigates to that URL.

The page-title is “Service Directory — Security definitions of services”.

The component itself has a heading of “List of security definitions”, matching the headings in `DefinitionListComponent` and `ServicesListComponent`.

It then has links to “Add a security definition” and “Service Directory Home”.
The latter goes to the same page as the “Services” link in the navigation header defined in `HomepageComponent`, since the list of services is on the homepage.

The list of security definitions is a series of `<article>` elements separated by horizontal rules (`<hr/>`).
Each definition has:

- the name of the security definition as the `<article>` element’s heading;
- the base URL of the service that the definition applies to;
- a link to edit the definition;
- the authorisation type (Basic, OAuth2, or Fixed headers).

On wider screens the “Edit” link appears to the left of the name and URL, and the authorisation type appears to the right.
On narrower screens, the “Edit” link and authorisation type appear underneath.

If there are no definitions in the directory, the component says so.
The links to “Add a security definition” and “Service Directory Home” still appear.

While the information is loading, or if an error has occurred in loading, the component says so, without the links to add a definition or go home.

## `SecurityEditPageComponent`

This is similar to `DefinitionEditComponent` and `ServiceEditPageComponent`, but for security definitions.

This component has a form for editing an existing security definition or creating a new one.
A component for setting custom HTTP headers (`HeaderListComponent`) is embedded at the end of the form.

There are text inputs for the definition’s name and the service’s URL.
Both are required; but if a definition is being created for a known service or URL, these fields may be pre-populated with a sensible value.

Then there is a `<select>` control for setting the authorisation type.
The options are Basic, OAuth2, and Fixed headers.

If the authorisation type is Basic, it means the service only requires a username and password for authentication, so the following text inputs appear:

- User name (required)
- Password (required)

If the authorisation type is OAuth2, it means the authentication is through Keycloak or a similar tool.
The following text inputs appear; they are all text inputs except “Omit Bearer prefix”:

- Client ID (required)
- Client field name (if this is left blank, Orchestration may use the value <samp>client_id</samp> for this)
- Client secret (required)
- Secret field name (if this is left blank, Orchestration may use the value <samp>client_secret</samp> for this)
- Authorisation URL (required, for Keycloak this could be a URL ending in <samp>/protocol/openid-connect/token</samp>)
- Grant type (if this is left blank, Orchestration may use the value <samp>client_credentials</samp> for this)
- Audience (optional)
- Omit Bearer prefix (a checkbox that modifies how the custom bearer header is used)
- Custom Bearer header (optional)

If the authorisation type is Fixed headers, no extra fields appear before `HeaderListComponent`.

At the end of the form (after `HeaderListComponent`) are these controls:

- “Save”, to create or update the definition with the information in the form (including headers), and navigate to the list of services;
- “Test”, to open `SecurityTestingModalComponent` for testing the service’s URL;
- “Cancel”, to navigate to the list of services without saving the form.

If a user has made a mistake in filling in the form, a warning message may be shown below the relevant field, or below the entire form.

### Considerations on different URLs

`SecurityEditPageComponent` is shown on the “edit” page for a security definition.
The URL for this can be:

- /gateway/{definition_id} which is what each “Edit” control in `SecurityListComponent` links to;
- /gateway/service/{service_id} which is what the “Authentication” control in `ServiceDetailsComponent` and `ServiceEditPageComponent` links to;
- /gateway/url/{url} which is not linked to by anything.

`SecurityEditPageComponent` is also shown on /gateway/add which is the page for creating a security definition.
The “Add a definition” link in `SecurityListComponent` goes to this page.

If the component is for editing a definition, the page-title is “Service Directory — Edit security definition” and the form contains the definition’s information.
If the component is for creating a definition, the page-title is “Service Directory — Add security definition” and the form is blank (except that the “Name” and “Service URL” fields might be pre-populated).

If the URL contains a definition ID but it does not match a definition, no form is shown.
Instead, there’s a message saying the definition does not exist, and a “Back” button that merely navigates to the Service Directory homepage.
The page-title is simply “Service Directory”.

If the URL is gateway/service/{service_id} but the service ID does not match a service, the component says no security definition could be loaded because the service doesn’t exist.

If the URL is gateway/url/{url} the component attempts to load a definition whose URL matches the embedded URL.
(For example, if the URL is /gateway/url/https:%2F%2Fexample.com a definition could be loaded whose URL is “https://example.com”, or whose URL begins with “https://example.com”, or whose URL appears at the start of “https://example.com”.)
If no such definition is found, the form will be for adding a security definition, with the name and URL fields pre-populated with the embedded URL.

## `HeaderListComponent`

This component appears inside `SecurityEditPageComponent` and adds a fieldset to the form in that component for creating/editing a security definition.
It is useful for adding custom HTTP headers to the authentication of services in the Service Directory.
Each header has a name and a value.

The names and values of headers are displayed in a HTML table.
By default, a security definition has no custom headers, so there are no rows in the table body.
The left-most cell of the table head contains a button for adding a header.
(The button’s visible text is simply a plus-sign, but its accessible name is “Add header”.)
This gives the table body a row that has a button to delete the header, an input for the header’s name, and an input for the header’s value.

After the name and value for a header have been entered, the “Add header” button can be used to add another header.
Headers cannot be added until the existing headers have been filled in.

The names of headers must be unique — the form cannot be submitted if two headers have the same name.

If a field is invalid, it will get a red border and warning icon (a circled exclamation mark).
The exact reason why it’s invalid is not stated, but the only possible reasons are the field being blank and a header name being a duplicate.

## `SecurityTestingModalComponent`

This component is displayed when the “Test” button at the end of `SecurityEditPageComponent` is clicked.

Like the other modal components in the Service Directory UI, it uses Angular’s modal facility, and it has a “close” icon in the top-right corner and a semi-transparent black overlay behind the modal.
The icon and overlay close the modal.

The purpose of `SecurityTestingModalComponent` is for testing the authentication details that have been entered in `SecurityEditPageComponent`.

The component has a text input for a URL, which by default is the value of “Service URL” in `SecurityEditPageComponent`.
There is also a text input labelled “Method”, which is “GET” by default, but can be any HTTP method or verb.
(Indeed, both the URL and the method can be any arbitrary string, but they are intended to be a valid URL and HTTP method.)

Next there’s a “Get response” button, which makes a HTTP request to the given URL with the given method, with the authentication details specified in `SecurityEditPageComponent`.
The response from this request is displayed in a `<textarea>` element underneath.

The URL and method in the modal can be changed, to enable the user to confirm that their security definition is correct for any endpoint and verb of their choosing.

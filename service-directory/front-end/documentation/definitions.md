# Service Directory UI — `DefinitionsModule`

This is the module that deals with common definitions.
These are fragments of specification that can be included in OpenAPI specifications for multiple services.

Common definitions cannot be deleted.

## `DefinitionListComponent`

This is the list of common definitions in the Service Directory.
It appears on the /definitions page.

The name of each definition is a link to the page for editing the definition (that page is `DefinitionEditComponent`).

Below the list is a link to “Add a definition”.

If there are no definitions in the directory, the component says so.
The “Add a definition” control still appears.

While the information is loading, or if an error has occurred in loading, the component says so, without the “Add a definition” control.

`ServicesListComponent` is a similar component, but for services, and its links point to a service details page instead of an edit page.

## `DefinitionEditComponent`

This component has a form for editing an existing common definition or creating a new one.

This component is shown on the “edit” page for a definition, which each definition name in `DefinitionListComponent` is a link to.
The URL for this is /definitions/edit/{definition_id}

The component is also shown on /definitions/edit which is the page for creating a definition.
The “Add a definition” link in `DefinitionListComponent` goes to this page.

If the component is for editing a definition, the page-title is “Service Directory — Edit definition” and the form contains the definition’s information.
If the component is for creating a definition, the page-title is “Service Directory — Create definition” and the form is blank.

If the URL contains a definition ID but it does not match a definition, the ID is ignored and the component acts as a “Create definition” form.
The page-title is simply “Service Directory”.

There are text inputs for the definition’s name (required) and value (marked as required but actually optional).
The definition’s value can contain line-breaks.

At the end of the form are these controls:

- “Save”, to create or update the definition with the information in the form, and navigate to the list of definitions;
- “Cancel”, to navigate to the list of definitions without saving the form.

If a user has made a mistake in filling in the form, a warning message may be shown below the relevant field, or below the entire form.

# Service Directory UI — `SharedModule`

This is the module that uses Angular’s mechanism for re-exporting libraries used across the whole application.
It contains also some common components that could be used in other projects.

The following libraries are not part of Angular but are used/exported by `SharedModule`:

- ICE Orchestration Portal Header (see [main architecture documentation](./architecture.md))
- Toastr (see [`GlobalErrorHandler`](./core.md) and `MsgboxService` below)
- `SpinButtonComponent` (see below)

## `MsgboxService`

Like `GlobalErrorHandler`, this is a wrapper around Toastr.
But instead of fitting into Angular’s exception-handling mechanism, it simply shows success-messages.
These appear in green in the top-right corner of the viewport.

## `SpinButtonComponent`

This is an Angular component that displays a button with text inside.
It has a `working` property, but this is passed into the component as a prop.

If `working` is true (ie, if the action associated with the button is in progress), a spinning “refresh” icon (two curved arrows pointing at each other) appears beside the button’s text.
If `working` is false, the icon does not appear.

Whatever component contains `SpinButtonComponent` is expected to control the `working` variable in the following way.
The button component raises an RxJs event when it is clicked.
The parent component listens for the event, and sets `working` to true when it happens (as well as performing whatever action the button is intended to trigger, such as a form-submission).
At the completion of the action, the parent component sets `working` to false.

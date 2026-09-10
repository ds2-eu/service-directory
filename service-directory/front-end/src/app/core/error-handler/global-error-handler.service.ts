import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private ngZone: NgZone) {}

  // Components have their own custom error-handling.
  // In case that is not sufficient, we have Toastr
  // as a global fallback to alert the user.

  handleError(data) {
    this.ngZone.run(() => {
      this.injector
        .get(ToastrService)
        .error(data ? data.error || data.message || data : 'unknown error');
    });

    console.error(data);
  }
}

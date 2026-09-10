import { ErrorHandler, NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { GlobalErrorHandler } from './error-handler/global-error-handler.service';

@NgModule({
  declarations: [],
  imports: [SharedModule],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
})
export class CoreModule {}

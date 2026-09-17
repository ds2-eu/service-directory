import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { PortalHeaderModule } from 'ds2-orchestration-portal-header';
//import { PortalHeaderModule } from 'ice-orchestration-portal-header';
import { SpinButtonComponent } from './spin-button/spin-button.component';

@NgModule({
  declarations: [
    SpinButtonComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
  ],

  exports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ModalModule,
    ToastrModule,
    SpinButtonComponent
  ],
})
export class SharedModule {}

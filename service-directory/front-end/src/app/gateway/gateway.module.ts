import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared';
import { HeaderListComponent } from './components/header-list/header-list.component';
import { SecurityEditPageComponent } from './components/security-edit/security-edit-page.component';
import { SecurityListPageComponent } from './components/security-list/security-list-page.component';
import { SecurityTestingModalComponent } from './components/security-testing-modal/security-testing-modal.component';

@NgModule({
  declarations: [
    SecurityEditPageComponent,
    SecurityListPageComponent,
    SecurityTestingModalComponent,
    HeaderListComponent,
  ],
  imports: [SharedModule, HttpClientModule, ReactiveFormsModule],
})
export class GatewayModule {}

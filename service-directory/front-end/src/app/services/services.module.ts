import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared';

import { ServiceDetailsComponent } from './components/service-details/service-details.component';
import { ServicesListComponent } from './components/services-list/services-list.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ServiceEditPageComponent } from './components/service-edit/service-edit-page.component';
import { ServiceDeleteModalComponent } from './components/service-delete-modal/service-delete-modal.component';
import { FourOFourPageComponent } from './components/four-o-four/four-o-four-page.component';
import { ServicePageChangeModalComponent } from './components/service-page-change-modal/service-page-change-modal.component';

@NgModule({
  declarations: [
    ServicesListComponent,
    ServiceDetailsComponent,
    HomepageComponent,
    ServicePageChangeModalComponent,
    ServiceEditPageComponent,
    ServiceDeleteModalComponent,
    FourOFourPageComponent,
  ],
  imports: [SharedModule, HttpClientModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ServicesModule {}

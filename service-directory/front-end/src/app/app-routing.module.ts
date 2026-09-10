import { ErrorHandler, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceEditPageComponent } from './services/components/service-edit/service-edit-page.component';
import { HomepageComponent } from './services/components/homepage/homepage.component';
import { FourOFourPageComponent } from './services/components/four-o-four/four-o-four-page.component';
import { SecurityListPageComponent } from './gateway/components/security-list/security-list-page.component';
import { SecurityEditPageComponent } from './gateway/components/security-edit/security-edit-page.component';
import { ServicesListComponent } from './services/components/services-list/services-list.component';
import { DefinitionEditComponent, DefinitionListComponent } from './definitions';
import { ServiceDetailsComponent } from './services/components/service-details/service-details.component';

const routes: Routes = [
  { 
    path: '', 
    component: HomepageComponent,
    children: [
      {
        path: '', redirectTo: 'services', pathMatch: 'full'
      },
      { 
        path: 'services', 
        component: ServicesListComponent,
        children: [
            { path: 'details/:id', component: ServiceDetailsComponent },
        ]
      },
      
      { path: 'services/edit', component: ServiceEditPageComponent },
      { path: 'services/edit/:id', component: ServiceEditPageComponent },
    
      { path: 'definitions', component: DefinitionListComponent },
      { path: 'definitions/edit', component: DefinitionEditComponent },
      { path: 'definitions/edit/:id', component: DefinitionEditComponent },
    
      { path: 'gateway', component: SecurityListPageComponent },
      { path: 'gateway/add', component: SecurityEditPageComponent },
      { path: 'gateway/url', redirectTo: 'gateway', pathMatch: 'full' },
      { path: 'gateway/url/:url', component: SecurityEditPageComponent },
      
      { path: 'gateway/service', redirectTo: 'gateway', pathMatch: 'full' },
      { path: 'gateway/service/:serviceId', component: SecurityEditPageComponent },
      { path: 'gateway/:definitionId', component: SecurityEditPageComponent },
    ]
  },
  
  { path: '**', pathMatch: 'full', component: FourOFourPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

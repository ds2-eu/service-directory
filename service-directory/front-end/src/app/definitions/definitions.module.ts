import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefinitionListComponent } from './list/definition-list.component';
import { SharedModule } from '@app/shared';
import { DefinitionEditComponent } from './edit/definition-edit.component';


@NgModule({
  declarations: [
    DefinitionListComponent,
    DefinitionEditComponent
  ],
  imports: [
    SharedModule
  ]
})
export class DefinitionsModule { }

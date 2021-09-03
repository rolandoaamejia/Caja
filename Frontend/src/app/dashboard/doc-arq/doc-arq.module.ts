import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocArqRoutingModule } from './doc-arq-routing.module';
import { ListComponent } from './pages/list/list.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { DeleteComponent } from './pages/delete/delete.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ListComponent,
    ListUsersComponent,
    DeleteComponent
  ],
  imports: [
    CommonModule,
    DocArqRoutingModule,
    SharedModule
  ]
})
export class DocArqModule { }

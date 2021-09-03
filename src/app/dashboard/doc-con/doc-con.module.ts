import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocConRoutingModule } from './doc-con-routing.module';
import { ListComponent } from './pages/list/list.component';
import { SharedModule } from '../../shared/shared.module';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { DeleteComponent } from './pages/delete/delete.component';


@NgModule({
  declarations: [
    ListComponent,
    ListUsersComponent,
    DeleteComponent
  ],
  imports: [
    CommonModule,
    DocConRoutingModule,
    SharedModule
  ]
})
export class DocConModule { }

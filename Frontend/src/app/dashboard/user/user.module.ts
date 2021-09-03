import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ListComponent } from './pages/list/list.component';
import { SharedModule } from '../../shared/shared.module';
import { DeleteComponent } from './pages/delete/delete.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EditComponent } from './pages/edit/edit.component';
import { EditPasswordComponent } from './pages/edit-password/edit-password.component';


@NgModule({
  declarations: [
    ListComponent,
    DeleteComponent,
    SignupComponent,
    EditComponent,
    EditPasswordComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
  ]
})
export class UserModule { }

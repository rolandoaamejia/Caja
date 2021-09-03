import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ShowComponent } from './pages/show/show.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ShowComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }

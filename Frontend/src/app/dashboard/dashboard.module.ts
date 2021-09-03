import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { MenuAdminComponent } from './pages/menu-admin/menu-admin.component';
import { MenuComponent } from './pages/menu/menu.component';

@NgModule({
  declarations: [
    HomeComponent,
    MenuAdminComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }

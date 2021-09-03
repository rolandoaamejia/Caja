import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './pages/list/list.component';
import { UploadComponent } from './pages/upload/upload.component';
import { DocConModRoutingModule } from './doc-con-mod-routing.module';



@NgModule({
  declarations: [
    ListComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    DocConModRoutingModule,
    SharedModule
  ]
})
export class DocConModModule { }

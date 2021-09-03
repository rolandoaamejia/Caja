import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocArqModRoutingModule } from './doc-arq-mod-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './pages/list/list.component';
import { UploadComponent } from './pages/upload/upload.component';


@NgModule({
  declarations: [
    ListComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    DocArqModRoutingModule,
    SharedModule
  ]
})
export class DocArqModModule { }

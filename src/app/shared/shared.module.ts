import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { Error404Component } from "./components/error404/error404.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { PaginatorPipe } from './pipes/paginator.pipe';


@NgModule({
  declarations: [
    Error404Component,
    NavbarComponent,
    FooterComponent,
    PaginatorPipe
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ToastrModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorPipe,
    NgbModule
    
  ],
  imports: [
    CommonModule,
    NgbModule,
    ToastrModule.forRoot({
      progressAnimation: 'decreasing',
      progressBar: true,
      closeButton: true,
      preventDuplicates: true,
      // resetTimeoutOnDuplicate: true,
      maxOpened: 3

    }),
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],

})
export class SharedModule { }

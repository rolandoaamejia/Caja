import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { Error404Component } from "./components/error404/error404.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";


@NgModule({
  declarations: [
    Error404Component,
    NavbarComponent,
    FooterComponent
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ToastrModule,
    ReactiveFormsModule,
    FormsModule,
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
    FormsModule
  ],

})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './pages/signin/signin.component';

const routes: Routes = [
  { path: "", redirectTo: "signin" },
  {
    path: "signin", component: SigninComponent
  }
  // {
  //   path: "",
  //   children: [
  //     {
  //       path: "business",
  //       loadChildren: () =>
  //         import("./business/business.module").then(
  //           (modele) => modele.BusinessModule
  //         ),
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

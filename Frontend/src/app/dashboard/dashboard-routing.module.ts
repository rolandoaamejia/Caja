import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileModule } from './profile/profile.module';
import { AdminGuard } from '../shared/guards/admin.guard';
import { DocArqModModule } from './doc-arq-mod/doc-arq-mod.module';

const routes: Routes = [
  { path: "", redirectTo: "home" },
  {
    path: "home", component: HomeComponent
  },
  {
    path: "",
    children: [
      {
        path: "users",
        canActivateChild: [AdminGuard],
        loadChildren: () =>
          import("./user/user.module").then(
            (modele) => modele.UserModule
          ),
      },
      {
        path: "docs-admin/conciliation",
        canActivateChild: [AdminGuard],
        loadChildren: () =>
          import("./doc-con/doc-con.module").then(
            (modele) => modele.DocConModule
          ),
      },
      {
        path: "docs-admin/arching",
        canActivateChild: [AdminGuard],
        loadChildren: () =>
          import("./doc-arq/doc-arq.module").then(
            (modele) => modele.DocArqModule
          ),
      },
      {
        path: "docs/conciliation",
        loadChildren: () =>
          import("./doc-con-mod/doc-con-mod.module").then(
            (modele) => modele.DocConModModule
          ),
      },
      {
        path: "docs/arching",
        loadChildren: () =>
          import("./doc-arq-mod/doc-arq-mod.module").then(
            (modele) => modele.DocArqModModule
          ),
      },
 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }

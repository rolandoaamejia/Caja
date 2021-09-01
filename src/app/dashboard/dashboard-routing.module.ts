import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileModule } from './profile/profile.module';

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
        loadChildren: () =>
          import("./user/user.module").then(
            (modele) => modele.UserModule
          ),
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./profile/profile.module").then(
            (modele) => modele.ProfileModule
          ),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }

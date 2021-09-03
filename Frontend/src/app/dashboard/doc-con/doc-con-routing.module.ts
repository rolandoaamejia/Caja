import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';

const routes: Routes = [
  { path: "", redirectTo: "users" },
  {
    path: "users", component: ListUsersComponent
  },
  {
    path: "users/list/:id",component: ListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocConRoutingModule { }

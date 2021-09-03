import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { ListComponent } from './pages/list/list.component';

const routes:  Routes = [
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
export class DocArqRoutingModule { }

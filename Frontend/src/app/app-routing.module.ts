import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './shared/components/error404/error404.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthLoginGuard } from './shared/guards/auth-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivateChild: [AuthLoginGuard],
    loadChildren: () => import('./auth/auth.module').then(modele => modele.AuthModule)
  },
  {
    path: 'dashboard',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(modele => modele.DashboardModule)
  },
  {
    path: 'page-not-found',
    component: Error404Component
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

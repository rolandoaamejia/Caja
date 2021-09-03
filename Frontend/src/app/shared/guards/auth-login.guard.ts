import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {

  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.authService.isLogin()) {
      return true;
    } else {
      this.router.navigate(['dashboard/home']);
      return false;
    }
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endPoint: string;
  constructor(private http: HttpClient, private router: Router) {
    this.endPoint = environment.endPoint;
  }

  public getToken(): string | undefined {
    return localStorage.getItem('token') || undefined;
  }
  public getRol(): string | undefined {
    return localStorage.getItem('rol') || undefined;
  }

  private setToken(token: string | undefined, usuario: string, rol: string): void {
    if (token && usuario) {
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', usuario);
      localStorage.setItem('rol', rol);

      this.router.navigate([`dashboard/home`])
    }
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['auth/signin'])
  }

  public isLogin(): boolean {
    return this.getToken() ? true : false;
  }

  public isAdmin(): boolean {
    return this.getRol() === 'Administrador' ? true : false;
  }

  public postSignin(usuario: Usuario): Observable<any> {
    // let headers = new HttpHeaders()
    // headers = headers.append('Authorization', 'undefined')
    return this.http.post<any>(`${this.endPoint}/auth/signin`, usuario).pipe(tap((res) => {
      this.setToken(res?.token, res?.usuario, res?.rol);
    }))
  }

  public postSignup(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.endPoint}/auth/signup`, usuario)
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private endPoint: string;
  public usuario: Usuario | undefined;

  constructor(private http: HttpClient, private router: Router) {
    this.endPoint = environment.endPoint;
  }

  public postSignup(usuario: Usuario): Observable<any> {

    return this.http.post<any>(`${this.endPoint}/users/signup`, usuario);
  }

  public getUsers(): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/users`);
  }

  public getUserById(id: number): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/users/${id}`);
  }

  public getUserNow(): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/user/now`);
  }

  public patchChangeStateById(id: number | undefined): Observable<any> {

    return this.http.patch<any>(`${this.endPoint}/users/state/${id}`, {});
  }

  public putUserById(id: number | undefined, usuario: Usuario): Observable<any> {

    return this.http.put<any>(`${this.endPoint}/users/update/${id}`, usuario);
  }

  public putUserPasswordAdminById(id: number | undefined, newPassword: string): Observable<any> {

    return this.http.put<any>(`${this.endPoint}/users/password-admin-update/${id}`, { newPassword });
  }

  public putUserPassword(password: string, newPassword: string): Observable<any> {

    return this.http.put<any>(`${this.endPoint}/users/password-update`, { password, newPassword });
  }

  public deleteUserById(id: number | undefined): Observable<any> {

    return this.http.delete<any>(`${this.endPoint}/users/delete/${id}`);
  }

}

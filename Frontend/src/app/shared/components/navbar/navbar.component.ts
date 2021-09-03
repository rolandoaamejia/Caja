import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  public getUserName(): string {
    return localStorage?.getItem('usuario') || 'Cuenta'
  }
  public logOut(): void {
    this.authService.logout();
  }

}

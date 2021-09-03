import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../shared/services/users.service';
import { Usuario } from '../../../../shared/interfaces/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../shared/auth/auth.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  public usuario: Usuario | undefined;
  public myForm: FormGroup = new FormGroup({});
  // public matchPassword: boolean = false;


  constructor(private usersService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUserNow();
    this.buildForm();
  }

  private buildForm(): void {
    this.myForm = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]]
    });
  }

  getUserNow(): void {
    this.usersService.getUserNow().subscribe((res) => {
      this.usuario = res;
      // console.log(this.usuario);

    }, (err) => {

    })
  }
  
  public onSubmit(): void {
    const { password, newPassword } = this.myForm.value
    this.usersService.putUserPassword(password, newPassword).subscribe((res) => {
      this.toastr.success(`${res.message}`);
      this.authService.logout();
    }, (err) => {
      // console.log(err);  
    });

  }


}

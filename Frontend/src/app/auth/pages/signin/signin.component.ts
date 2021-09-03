import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/auth/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public myForm: FormGroup = new FormGroup({});

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.myForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  public onSubmit(): void {
    this.authService.postSignin(this.myForm.value).subscribe((res) => {
      this.toastr.success(`Bienvenido ${localStorage.getItem('usuario')}`);
    }, (err) => {
      // console.log(err);  
    })

  }

}

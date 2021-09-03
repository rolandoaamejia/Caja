import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/shared/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public myForm: FormGroup = new FormGroup({});

  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private usersService: UsersService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.myForm = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
    })
  }

  signup(): void {
    this.usersService.postSignup(this.myForm.value).subscribe((res) => {
      this.toastr.success(`${res.message}`);
      this.modal.close();
    }, (err) => {
      // console.log(err);  
    })
  }

}

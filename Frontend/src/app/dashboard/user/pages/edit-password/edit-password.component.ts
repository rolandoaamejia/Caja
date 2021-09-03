import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnInit {

  public usuario: Usuario | undefined;
  public myForm: FormGroup = new FormGroup({});

  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private usersService: UsersService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.usuario = this.usersService.usuario;
    this.buildForm();
  }

  private buildForm(): void {
    this.myForm = this.fb.group({
      newPassword: ['', [Validators.required]],
    })
  }

  onSubmit() {
    this.usersService.putUserPasswordAdminById(this.usuario?.id, this.myForm.get('newPassword')?.value).subscribe((res) => {
      this.toastr.success(`${res.message}`);
      this.modal.close();
    }, (err) => {
      // console.log(err);  
    })
  }
}
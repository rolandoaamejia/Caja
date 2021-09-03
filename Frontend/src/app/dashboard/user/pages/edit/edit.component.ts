import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/shared/services/users.service';
import { Usuario } from '../../../../shared/interfaces/usuario';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

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
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
    })

    this.myForm.patchValue({
      nombres: this.usuario?.nombres,
      apellidos: this.usuario?.apellidos
    })
  }

  onSubmit() {
    this.usersService.putUserById(this.usuario?.id, this.myForm.value).subscribe((res) => {
      this.toastr.success(`${res.message}`);
      this.modal.close();
    }, (err) => {
      // console.log(err);  
    })
  }

}

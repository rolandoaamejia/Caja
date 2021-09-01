import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../../../shared/interfaces/usuario';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../../shared/services/users.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  public usuario: Usuario | undefined;
  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.usuario = this.usersService.usuario;
  }

  delete(): void {
    this.usersService.deleteUserById(this.usuario?.id).subscribe((res) => {
      this.toastr.success(`${res.message}`);
      this.modal.close();
    })
  }
}

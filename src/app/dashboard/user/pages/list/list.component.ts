import { Component, OnInit, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Usuario } from '../../../../shared/interfaces/usuario';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../../../shared/services/users.service';
import { map, startWith } from 'rxjs/operators';
import { DeleteComponent } from '../delete/delete.component';
import { ToastrService } from 'ngx-toastr';
import { SignupComponent } from '../signup/signup.component';
import { EditComponent } from '../edit/edit.component';
import { EditPasswordComponent } from '../edit-password/edit-password.component';

const MODALS: { [name: string]: Type<any> } = {
  signup: SignupComponent,
  editUser: EditComponent,
  editPassword: EditPasswordComponent,
  deleteUser: DeleteComponent,
};

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public usuarios: Usuario[] | [] = [];

  public page: number = 1;
  public pageSize: number = 10;
  public collectionSize: number = 0;

  public filterControl = new FormControl("");

  public filteredOptions$: Observable<Usuario[] | any> | undefined;

  constructor(
    private configModal: NgbModalConfig,
    private _modalService: NgbModal,
    private usersService: UsersService,
    private toastr: ToastrService
  ) {
    configModal.backdrop = "static";
    configModal.keyboard = false;
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe((res) => {

      this.usuarios = res;
      // console.log(res);

      this.filteredOptions$ = this.filterControl.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );

      this.filteredOptions$.subscribe((res) => {
        this.collectionSize = res.length || 1;
        // this.pageSize = 3;
      });
    })
  }

  getUserNow(): string {
    return localStorage.getItem('usuario') || 'null';
  }

  private _filter(value: string): Usuario[] {
    return this.usuarios.filter((usuario: Usuario) => {
      const term = value.toLowerCase();
      return usuario.usuario.toLowerCase().includes(term) ||
        usuario.nombres?.toLowerCase().includes(term) ||
        usuario.apellidos?.toLowerCase().includes(term) ||
        usuario.fechaActualizacion?.toString().includes(term) ||
        usuario.rol?.nombre.toLowerCase().includes(term);
    });
  }

  openModals(name: string, usuario?: Usuario): void {
    this.usersService.usuario = usuario;

    this._modalService.open(MODALS[name]);
    this._modalService.activeInstances.subscribe((res) => {
      if (!this._modalService.hasOpenModals()) {
        this.getUsers();
      }
    });
  }


  changeState(id: number): void {
    this.usersService.patchChangeStateById(id).subscribe((res) => {
      this.toastr.success(`${res?.message}`);
      this.getUsers();
    })
  }
}

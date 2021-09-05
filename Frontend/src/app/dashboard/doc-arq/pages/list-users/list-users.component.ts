import { Component, OnInit, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { UsersService } from 'src/app/shared/services/users.service';
import { SignupComponent } from '../../../user/pages/signup/signup.component';
import { AuthService } from '../../../../shared/auth/auth.service';

const MODALS: { [name: string]: Type<any> } = {
  signup: SignupComponent,

};

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {


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
    public authService:AuthService,
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

  private _filter(value: string): Usuario[] {
    return this.usuarios.filter((usuario: Usuario) => {
      const term = value.toLowerCase();
      return usuario.usuario.toLowerCase().includes(term) ||
        usuario.nombres?.toLowerCase().includes(term) ||
        usuario.apellidos?.toLowerCase().includes(term);
    });
  }


  openModals(name: string, usuario?: Usuario): void {
    this._modalService.open(MODALS[name]);
    this._modalService.activeInstances.subscribe((res) => {
      if (!this._modalService.hasOpenModals()) {
        this.getUsers();
      }
    });
  }
}

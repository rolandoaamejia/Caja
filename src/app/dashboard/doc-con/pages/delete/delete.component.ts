import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { UsersService } from 'src/app/shared/services/users.service';
import { DocConService } from '../../../../shared/services/doc-con.service';
import { DocumentCon } from '../../../../shared/interfaces/documentCon';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {


  public usuario: Usuario | undefined;
  public documento: DocumentCon | undefined;
  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private usersService: UsersService,
    private docConService: DocConService
  ) { }

  ngOnInit(): void {
    this.usuario = this.usersService.usuario;
    this.documento = this.docConService.doc;
  }

  delete(): void {
    this.docConService.deleteDocumentAdminByCode(this.usuario?.id, this.documento?.codigo).subscribe((res) => {
      this.toastr.success(`${res.message}`);
      this.modal.close();
    }, (err) => this.modal.close());
  }

}

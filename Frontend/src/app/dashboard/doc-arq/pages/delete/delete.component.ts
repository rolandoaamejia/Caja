import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/shared/interfaces/usuario';
import { UsersService } from 'src/app/shared/services/users.service';
import { DocArqService } from '../../../../shared/services/doc-arq.service';
import { DocumentArq } from '../../../../shared/interfaces/documentArq';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {


  public usuario: Usuario | undefined;
  public documento: DocumentArq | undefined;
  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private usersService: UsersService,
    private docArqService: DocArqService
  ) { }

  ngOnInit(): void {
    this.usuario = this.usersService.usuario;
    this.documento = this.docArqService.doc;
  }

  delete(): void {
    this.docArqService.deleteDocumentAdminByCode(this.usuario?.id, this.documento?.codigo).subscribe((res) => {
      this.toastr.success(`${res.message}`);
      this.modal.close();
    }, (err) => this.modal.close());
  }

}

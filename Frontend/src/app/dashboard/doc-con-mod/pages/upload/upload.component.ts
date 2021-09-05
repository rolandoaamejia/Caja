import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DocArqService } from 'src/app/shared/services/doc-arq.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentCon } from '../../../../shared/interfaces/documentCon';
import { DocumentArq } from '../../../../shared/interfaces/documentArq';
import { DocConService } from '../../../../shared/services/doc-con.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  public myForm: FormGroup = new FormGroup({});

  public selectedFileImage: any | undefined;
  public labelSelectedFileImage: string = "Seleccionar un documento XLSX";

  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private docConService: DocConService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.myForm = this.fb.group({
      cuenta: ['', [Validators.required]],
      banco: ['', [Validators.required]],
      fechaDocumento: ['', [Validators.required]],
      documento: [null, [Validators.required]]
    })
  }

  public onFileChanged(event: any) {
    this.selectedFileImage = event.target?.files[0];
    this.labelSelectedFileImage = (this.selectedFileImage?.name).split(".")[0];
  }

  upload(): void {
    const { day, month, year } = this.myForm.get("fechaDocumento")?.value;
    const doc = {
      cuenta: this.myForm.get('cuenta')?.value,
      banco: this.myForm.get('banco')?.value,
      fechaDocumento: new Date(`${year}-${month}-${day}`),
    } as DocumentArq;

    this.docConService.postUploadDocument(doc, this.selectedFileImage).subscribe((res) => {
      this.toastr.success(`${res.message}`);
      this.modal.close();
    })

  }
}

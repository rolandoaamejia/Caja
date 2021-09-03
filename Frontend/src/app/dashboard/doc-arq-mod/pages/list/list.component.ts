import { Component, OnInit, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalConfig, NgbModal, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users.service';
import { startWith, map } from 'rxjs/operators';
import { DocumentArq } from '../../../../shared/interfaces/documentArq';
import { DocArqService } from '../../../../shared/services/doc-arq.service';
import { UploadComponent } from '../upload/upload.component';


const MODALS: { [name: string]: Type<any> } = {
  uploadDoc: UploadComponent
};

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public documents: DocumentArq[] | [] = [];

  public page: number = 1;
  public pageSize: number = 9;
  public collectionSize: number = 0;

  public filterControl = new FormControl("");

  public filteredOptions$: Observable<DocumentArq[] | any> | undefined;

  dateFormat = {
    day: 1,
    month: 2,
    year: 2021
  } as NgbDate;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;


  constructor(
    private configModal: NgbModalConfig,
    private _modalService: NgbModal,
    private usersService: UsersService,
    private docArqService: DocArqService,
    private toastr: ToastrService,
    private actRoute: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
  ) {
    this.fromDate = calendar.getPrev(calendar.getToday(), "y", 1);
    this.toDate = calendar.getNext(calendar.getToday(), "d", 1);
  }

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments(): void {
    this.docArqService.getDocuments(this.formatter.format(this.calendar.getPrev(this.fromDate || this.dateFormat, "d", 1)), this.formatter.format(this.calendar.getNext(this.toDate || this.dateFormat, "d", 1))).subscribe((res) => {

      this.documents = res;

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

  private _filter(value: string): DocumentArq[] {
    return this.documents.filter((doc: DocumentArq) => {
      const term = value.toLowerCase();
      return doc.codigo.toLowerCase().includes(term) ||
        doc.banco.toLowerCase().includes(term) ||
        doc.cuenta.toLowerCase().includes(term) ||
        doc.oficina.toLowerCase().includes(term) ||
        doc.responsable.toLowerCase().includes(term) ||
        doc.fechaDocumento.toString().includes(term);
    });
  }


  openModals(name: string, doc?: DocumentArq): void {
    this._modalService.open(MODALS[name]);
    this._modalService.activeInstances.subscribe((res) => {
      if (!this._modalService.hasOpenModals()) {
        this.getDocuments();
      }
    });
  }

  downloadXLSX(codigo: string): void {
    this.docArqService.getDocumentXLSXByCode(codigo).subscribe((res) => {
      var newBlob = new Blob([res], { type: "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," });
      const data = window.URL.createObjectURL(newBlob);

      let link = document.createElement('a');
      link.href = data;
      // window.open(link.href);
      link.download = `Documento ${codigo.toUpperCase()}.xlsx`;
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    })

  }


  //#region NG DatePicker
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  //#endregion

}

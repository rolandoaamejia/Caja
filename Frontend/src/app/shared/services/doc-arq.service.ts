import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentArq } from '../interfaces/documentArq';
import { DocumentCon } from '../interfaces/documentCon';

@Injectable({
  providedIn: 'root'
})
export class DocArqService {
  private endPoint: string;
  public doc: DocumentArq | undefined;

  constructor(private http: HttpClient, private router: Router) {
    this.endPoint = `${environment.endPoint}/doc`;
  }

  public postUploadDocument(documentArq: DocumentArq, documento: any): Observable<any> {

    let formData: FormData = new FormData();
    formData.append("documento", documento);
    formData.append("cuenta", documentArq.cuenta);
    formData.append("banco", documentArq.banco);
    formData.append("oficina", documentArq.oficina);
    formData.append("responsable", documentArq.responsable);
    formData.append("fechaDocumento", (documentArq.fechaDocumento).toString());

    return this.http.post<any>(`${this.endPoint}/upload-arching`, formData);
  }

  public getDocumentsAdminById(id: number, fromDate: string, toDate: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/admin-arches/${id}?start=${fromDate}&end=${toDate}`)
  }

  public getDocumentAdminByCode(id: number | undefined, codigo: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/admin-arching/${id}/${codigo}`)
  }

  public getDocumentXLSXAdminById(id: number | undefined, codigo: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/arching-pdf/${id}/${codigo}`, {
      responseType: 'blob' as 'json'
    })
  }


  public deleteDocumentAdminByCode(id: number | undefined, codigo: string | undefined): Observable<any> {

    return this.http.delete<any>(`${this.endPoint}/admin-arching/${id}/${codigo}`)
  }

  //* Moderador

  public getDocuments(fromDate: string, toDate: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/arches?start=${fromDate}&end=${toDate}`)
  }

  public getDocumentByCode(codigo: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/arching/${codigo}`)
  }

  public getDocumentXLSXByCode(id: number | undefined, codigo: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/arching-pdf/${id}/${codigo}`, {
      responseType: 'blob' as 'json'
    })
  }
}

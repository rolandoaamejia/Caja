import { Injectable } from '@angular/core';
import { DocumentCon } from '../interfaces/documentCon';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocConService {
  private endPoint: string;
  public doc: DocumentCon | undefined;

  constructor(private http: HttpClient, private router: Router) {
    this.endPoint = `${environment.endPoint}/doc`;
  }

  public postUploadDocument(documentCon: DocumentCon, documento: any): Observable<any> {

    let formData: FormData = new FormData();
    formData.append("documento", documento);
    formData.append("cuenta", documentCon.cuenta);
    formData.append("banco", documentCon.banco);
    formData.append("fechaDocumento", (documentCon.fechaDocumento).toString());

    return this.http.post<any>(`${this.endPoint}/upload-conciliation`, formData);
  }

  public getDocumentsAdminById(id: number, fromDate: string, toDate: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/admin-conciliations/${id}?start=${fromDate}&end=${toDate}`)
  }

  public getDocumentAdminByCode(id: number | undefined, codigo: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/admin-conciliation/${id}/${codigo}`)
  }

  public getDocumentXLSXAdminById(id: number | undefined, codigo: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/conciliation-pdf/${id}/${codigo}`, {
      responseType: 'blob' as 'json'
    })
  }


  public deleteDocumentAdminByCode(id: number | undefined, codigo: string | undefined): Observable<any> {

    return this.http.delete<any>(`${this.endPoint}/admin-conciliation/${id}/${codigo}`)
  }

  //* Moderador

  public getDocuments(fromDate: string, toDate: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/conciliations?start=${fromDate}&end=${toDate}`)
  }

  public getDocumentByCode(codigo: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/conciliation/${codigo}`)
  }

  public getDocumentXLSXByCode(codigo: string): Observable<any> {

    return this.http.get<any>(`${this.endPoint}/conciliation-pdf/${codigo}`, {
      responseType: 'blob' as 'json'
    })
  }



}

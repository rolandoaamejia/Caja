import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private toastr: ToastrService, private authService: AuthService) {

  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let handled: boolean = false;

    return next.handle(req).pipe(
      retry(1),
      catchError((returnedError) => {
        let errorMessage = null;

        if (returnedError.error instanceof ErrorEvent) {
          errorMessage = `Error: ${returnedError.error.message}`;
        } else if (returnedError instanceof HttpErrorResponse) {
          errorMessage = `Error Status ${returnedError.status}: ${returnedError.error.error} - ${returnedError.error.message}`;
          handled = this.handleServerSideError(returnedError);
        }

        console.error(errorMessage ? errorMessage : returnedError);

        this.toastr.error(`${returnedError.error.message || 'Error desconocido'}`)

        if (!handled) {
          if (errorMessage) {
            return throwError(errorMessage);
          } else {
            return throwError("Unexpected problem occurred");
          }
        } else {
          return of(returnedError);
        }
      })
    );
  }

  private handleServerSideError(error: HttpErrorResponse): boolean {
    let handled: boolean = false;

    switch (error.status) {
      case 401:
        this.authService.logout();

        handled = true;
        break;
    }

    return handled;
  }
}

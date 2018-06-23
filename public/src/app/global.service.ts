import { Injectable } from '@angular/core';
import { HttpClientService } from '../app/http-client.service'
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private httpClient: HttpClientService, private cookieService: CookieService) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      if (error.status == 401) {
        this.cookieService.delete('id_token');
        window.location.replace("https://auth.hadamba.com/login?response_type=token&client_id=4hiaorc0v5d7dnv1nl1fq8dbqa&redirect_uri=" + environment.authRedirectURL);
      }
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  getMembers(): Observable<any> {
    return this.httpClient.get('https://z5vr51yi5k.execute-api.eu-central-1.amazonaws.com/dev/members').pipe(
      map( res => {
        return res.json()
      }),
      catchError(this.handleError.bind(this))
    )
  }
  getDraw(): Observable<any> {
    const token: string = this.cookieService.get('id_token');
    return this.httpClient.get('https://z5vr51yi5k.execute-api.eu-central-1.amazonaws.com/dev/lottery/mine?id_token=' + token).pipe(
      map(res => {
        return res.json();
      }),
      catchError( this.handleError.bind(this))
    )
  } 
}


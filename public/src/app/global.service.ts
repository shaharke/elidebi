import { Injectable } from '@angular/core';
import { HttpClientService } from '../app/http-client.service'
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private httpClient: HttpClientService, private cookieService: CookieService) { }

  sendToLogin(): void {
    window.location.replace("https://auth.hadamba.com/login?response_type=token&client_id=4hiaorc0v5d7dnv1nl1fq8dbqa&redirect_uri=" + environment.authRedirectURL);
  }

  getMembers(): Observable<any> {
    return this.httpClient.get('https://z5vr51yi5k.execute-api.eu-central-1.amazonaws.com/dev/members').pipe(
      map( res => {
        if (res.status == 401) {
          this.sendToLogin();
          return;
        }
        return res.json()
      })
    )
  }
  getDraw(): Observable<any> {
    const token: string = this.cookieService.get('id_token');
    return this.httpClient.get('https://z5vr51yi5k.execute-api.eu-central-1.amazonaws.com/dev/lottery/mine?id_token=' + token).pipe(
      map(res =>{
        if (res.status == 401) {
          this.sendToLogin();
          return;
        }
        return res.json();
      })
    )
  } 
}


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers, Response, RequestOptions } from "@angular/http";

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: Http) {

  }

  appendAuthorizationHeader(headers: Headers) {
    headers.append('x-api-key', 'maHQjxIQHG2JXKWIsYzwk7CypjCBDNAT8LBggMfY');
  }

  get(url: string): Observable<Response> {
    let headers = new Headers();
    this.appendAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options);
  }

  post(url: string, data: any): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.appendAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, data, options);
  }

  // postFile(url: string, data: any): Observable<Response> {
  //   let headers = new Headers();
  //   this.appendAuthorizationHeader(headers);
  //   let options = new RequestOptions({ headers: headers });
  //   let formData = new FormData();
  //   formData.append("objectType", data.objectType);
  //   formData.append("specGroup", this.global.getSepcGroup());
  //   formData.append("objId", data.objId);
  //   formData.append("docType", data.docType);
  //   formData.append("file1", data.file);
  //   return this.http.post(url, formData, options);
  // }

  put(url: string, data: any): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.appendAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(url, data, options);
  }

  delete(url: string): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.appendAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(url, options);
  }

  // handleError(error: Response | any): Observable<string> {
  //   // this.toaster.popHejaToaster(HejaToasterTypes.ERROR, "Error", error);

  //   //in case 401 navigates to login page
  //   if (error.status == 401) {
  //     this.router.navigate(['']);
  //   }

  //   return Observable.throw(error);
  // }
}

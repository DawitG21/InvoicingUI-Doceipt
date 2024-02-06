import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHttp } from '../interfaces/ihttp';

@Injectable({
  providedIn: 'root'
})
export class HttpService implements IHttp {

  constructor(
    private httpClient: HttpClient
  ) { }


  get(url: string, options?: any): Observable<any> {
    return this.httpClient.get(url, options);
  }

  post(url: string, body: any, options?: any): Observable<any> {
    return this.httpClient.post(url, body, options);
  }

  put(url: string, body: any, options?: any): Observable<any> {
    return this.httpClient.put(url, body, options);
  }

  delete(url: string, options?: any): Observable<any> {
    return this.httpClient.delete(url, options);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';

import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from '../../core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';

import { Contact } from 'src/app/models/contact.model';
import { ContactNew } from 'src/app/models/contact-new.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends BaseService {
  httpOptions: any;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  get(id: string): Observable<Contact> {
    return this.http.get(this.resEndpoint.ContactGetUri(id),
      this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue)
    ).pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(newContact: ContactNew): Observable<Contact> {
    return this.http.post(this.resEndpoint.ContactUri, newContact, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(contact: Contact): Observable<Contact> {
    return this.http.put(this.resEndpoint.ContactUri, contact, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<Contact> {
    return this.http.delete(this.resEndpoint.ContactGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  search(companyId: string, model: any, page: number, pageSize: number, sortOrder: string, importOnly: boolean, href?: string): Observable<any> {
    let searchUrl: string;
    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.ContactUri;
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${model}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&importOnly=${importOnly}`;
    }
    return this.http.get(searchUrl, this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue))
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  isModelValid(model: ContactNew): boolean {
    return !(!model.name || model.name === ''
      || !model.emails || model.emails.length === 0
      || !model.gender || model.gender === ''
      || !model.companyId || model.companyId === '');

  }
}

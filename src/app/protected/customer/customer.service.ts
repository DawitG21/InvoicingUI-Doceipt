import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from '../../core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';

import { Customer } from 'src/app/models/customer.model';
import { CustomerNew } from 'src/app/models/customer-new.model';
import { CustomerEdit } from 'src/app/models/customer-edit.model';
import { CustomerSearch } from 'src/app/models/customer-search.model';
import { ImportStatus } from 'src/app/models/import-status.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {
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

  public get(id: string): Observable<Customer> {
    return this.http.get(this.resEndpoint.CustomerGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public create(newCustomer: CustomerNew): Observable<Customer> {
    return this.http.post(this.resEndpoint.CustomerUri, newCustomer, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public update(customer: CustomerEdit): Observable<Customer> {
    return this.http.put(this.resEndpoint.CustomerUri, customer, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public search(companyId: string, searchText: any, model: CustomerSearch,
    page: number, pageSize: number, sortOrder: string, href?: string): Observable<any> {
    let searchUrl: string;

    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.CustomerUri;
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.post(searchUrl, model, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public getDueInvoices(id: string): Observable<any> {
    return this.http.get(this.resEndpoint.CustomerGetDueInvoicesUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public delete(id: string): Observable<Customer> {
    return this.http.delete(this.resEndpoint.CustomerDeleteUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public import(companyId: string): Observable<any> {
    return this.http.get(this.resEndpoint.importCustomer(companyId), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public importStatus(companyId: string): Observable<ImportStatus> {
    return this.http.get(this.resEndpoint.importCustomerStatus(companyId), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public isModelValid(model: any): boolean {
    return !(!model.name || model.name === ''
      || !model.referenceId || model.referenceId === ''
      || !model.customerGroupId || model.customerGroupId === '');
  }

  public searchWithStatus(companyId: string, searchText: any, model: CustomerSearch,
    page: number, pageSize: number, sortOrder: string, href?: string, active?: boolean): Observable<any> {
    let searchUrl: string;

    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.CustomerUri;
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&active=${active}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.post(searchUrl, model, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

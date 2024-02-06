import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BatchInvoiceNew } from 'src/app/interfaces/batch-invoice-new';

import { BaseService } from 'src/app/shared/base.service';
import { HttpService } from 'src/app/providers/http.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BatchInvoiceSearch } from 'src/app/interfaces/batch-invoice-search';

@Injectable({
  providedIn: 'root'
})
export class BatchInvoiceService extends BaseService {

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

  get(id: string): Observable<any> {
    return this.http.get(`${this.resEndpoint.BatchInvoiceUri}/${id}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  /**
     * Constructs a `POST` request that interprets the body as an `SearchBatchInvoice` and returns
     * an `SearchResult`.
     *
     * @param companyId The company ID.
     * @param model The batch invoice search object.
     * @param page The current page.
     * @param pageSize The page size.
     * @param sort The sort direction i.e. asc or desc.
     *
     * @return An `Observable` of the response, with the response body as an `SearchResult`.
     */
  search(companyId: string, model: BatchInvoiceSearch, page: number, pageSize: number, sortOrder: string, href?: string): Observable<any> {
    let searchUrl: string;

    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.BatchInvoiceUri;
      searchUrl = `${baseUrl}/${companyId}/search?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.post(searchUrl, model, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(model: BatchInvoiceNew): Observable<any> {
    return this.http.post(this.resEndpoint.BatchInvoiceUri, model, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  void(id: string): Observable<any> {
    return this.http.put(`${this.resEndpoint.BatchInvoiceUri}/${id}`, null, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.resEndpoint.BatchInvoiceUri}/${id}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

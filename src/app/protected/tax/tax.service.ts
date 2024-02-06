import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';

import { Tax } from 'src/app/models/tax.model';
import { TaxNew } from 'src/app/models/tax-new.model';

@Injectable({
  providedIn: 'root'
})

export class TaxService extends BaseService {
  httpOptions: any;

  constructor(
    private resEndpoint: ResourceEndpointService,
    private http: HttpService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  search(companyId: string, searchText: any,
    page: number, pageSize: number, sortOrder: string, active?: boolean): Observable<any> {
    const baseUrl = this.resEndpoint.TaxUri;
    let searchUrl: string;

    if (active || active === false) {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&active=${active}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    } else {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  create(newTax: TaxNew): Observable<Tax> {
    return this.http.post(this.resEndpoint.TaxUri, newTax, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(tax: Tax): Observable<Tax> {
    return this.http.put(this.resEndpoint.TaxUri, tax, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<Tax> {
    return this.http.delete(this.resEndpoint.TaxDeleteUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';

import { PaymentMethodNew } from 'src/app/models/payment-method-new.model';
import { PaymentMethod } from 'src/app/models/payment-method.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService extends BaseService {

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
    const baseUrl = this.resEndpoint.PaymentMethodUri;
    let searchUrl: string;

    if (active || active === false) {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&active=${active}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    } else {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  createPaymentMethod(newPaymentMethod: PaymentMethodNew): Observable<PaymentMethod> {
    return this.http.post(this.resEndpoint.PaymentMethodUri, newPaymentMethod, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  updatePaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    return this.http.put(this.resEndpoint.PaymentMethodUri, paymentMethod, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<PaymentMethod> {
    return this.http.delete(this.resEndpoint.PaymentMethodDeleteUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

}


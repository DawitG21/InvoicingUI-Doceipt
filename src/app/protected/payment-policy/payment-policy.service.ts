import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from '../../core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';

import { PaymentPolicy } from 'src/app/models/payment-policy.model';
import { PaymentPolicyNew } from 'src/app/models/payment-policy-new.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentPolicyService extends BaseService {

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

  get(id: string): Observable<PaymentPolicy> {
    return this.http.get(this.resEndpoint.PaymentPolicyGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  getAll(companyId: string): Observable<PaymentPolicy[]> {
    return this.http.get(this.resEndpoint.PaymentPolicyAllUri(companyId), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(newPaymentPolicy: PaymentPolicyNew): Observable<PaymentPolicyNew> {
    return this.http.post(this.resEndpoint.PaymentPolicyUri, newPaymentPolicy, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(paymentPolicy: PaymentPolicy): Observable<PaymentPolicy> {
    return this.http.put(this.resEndpoint.PaymentPolicyUri, paymentPolicy, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<PaymentPolicy> {
    return this.http.delete(this.resEndpoint.PaymentPolicyGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

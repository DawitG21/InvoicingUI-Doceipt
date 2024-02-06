import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';

import { AuthService } from '../../core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';

import { BillingAddress } from 'src/app/models/billing-address.model';
import { BillingAddressNew } from 'src/app/models/billing-address-new.model';
import { BillingAddressUpdate } from 'src/app/models/billing-address-update.model';

@Injectable({
  providedIn: 'root',
})
export class BillingAddressService extends BaseService {

  public httpOptions: any;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private authService: AuthService,
    private protectedService: ProtectedService,
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  public get(id: string): Observable<BillingAddress> {
    return this.http.get(this.resEndpoint.BillingAddressGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public create(newBillingAddress: BillingAddressNew): Observable<BillingAddress> {
    return this.http.post(this.resEndpoint.BillingAddressUri, newBillingAddress, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public update(billingAddress: BillingAddressUpdate): Observable<BillingAddress> {
    return this.http.put(this.resEndpoint.BillingAddressUri, billingAddress, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public delete(id: string): Observable<BillingAddress> {
    return this.http.delete(this.resEndpoint.BillingAddressDeleteUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseService } from 'src/app/shared/base.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ProtectedService } from '../protected.service';

import { ServiceFee } from 'src/app/models/service-fee.model';
import { ServiceFeeNew } from 'src/app/models/service-fee-new.model';
import { ServiceFeeUpdate } from 'src/app/models/service-fee-update.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceFeeService extends BaseService {

  httpOptions: any;
  subscription: Subscription | any;

  constructor(
    private resEndpoint: ResourceEndpointService,
    private http: HttpService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) {

    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private promise(companyId: string, page: number, pageSize: number, sortOrder: string, customerGroupId?: string, paymentCyleId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.subscription = this.search(companyId, '', page, pageSize, sortOrder,customerGroupId, paymentCyleId, true).subscribe((result: any) => {
        if (result.data && result.data.length === 0) {
          reject();
        }
        else {
          resolve(result.data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  public async getAll(companyId: string, page: number, pageSize: number, customerGroupId?: string, paymentCyleId?: string) {
    let taskRunning: boolean = true;
    let data: ServiceFee[] = [];

    while (taskRunning) {
      await this.promise(companyId, page, pageSize, 'asc', customerGroupId, paymentCyleId).then(resolveResult => {
        page++;
        data = data.concat(resolveResult);

      }, rejectResult => {
        taskRunning = false;

      }).catch(error => {
        // handle error
        taskRunning = false;
      });
    }

    return data;
  }

  search(companyId: string, searchText: any,
    page: number, pageSize: number, sortOrder: string, customerGroupId?: string, paymentCyleId?: string, active?: boolean): Observable<any> {
    const baseUrl = this.resEndpoint.ServiceFeeUri;
    let searchUrl: string;

    if (active || active === false) {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&active=${active}&customerGroup=${customerGroupId}&paymentCycle=${paymentCyleId}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    } else {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&customerGroup=${customerGroupId}&paymentCycle=${paymentCyleId}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  create(newServiceFee: ServiceFeeNew): Observable<ServiceFee> {
    return this.http.post(this.resEndpoint.ServiceFeeUri, newServiceFee, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(serviceFee: ServiceFeeUpdate): Observable<ServiceFee> {
    return this.http.put(this.resEndpoint.ServiceFeeUri, serviceFee, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<ServiceFee> {
    return this.http.delete(this.resEndpoint.ServiceFeeDeleteUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  deleteTax(serviceFeeId: string, taxId: string): Observable<ServiceFee> {
    return this.http.delete(this.resEndpoint.ServiceFeeTaxUri(serviceFeeId, taxId), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  addServiceFeeTax(serviceFeeId: string, taxId: string): Observable<ServiceFee> {
    return this.http.post(this.resEndpoint.ServiceFeeTaxUri(serviceFeeId, taxId), null, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

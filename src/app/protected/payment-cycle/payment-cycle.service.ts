import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ProtectedService } from '../protected.service';

import { PaymentCycleNew } from 'src/app/models/payment-cycle-new.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';

import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentCycleService extends BaseService {

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

  search(companyId: string, searchText: any,
    page: number, pageSize: number, sortOrder: string, active?: boolean): Observable<any> {
    const baseUrl = this.resEndpoint.PaymentCycleUri;
    let searchUrl: string;

    if (active) {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&active=${active}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    } else {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  create(newPaymentCycle: PaymentCycleNew): Observable<PaymentCycle> {
    return this.http.post(this.resEndpoint.PaymentCycleUri, newPaymentCycle, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(paymentCycle: PaymentCycle): Observable<PaymentCycle> {
    return this.http.put(this.resEndpoint.PaymentCycleUri, paymentCycle, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<PaymentCycle> {
    return this.http.delete(this.resEndpoint.PaymentCycleGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  private promise(companyId: string, page: number, pageSize: number, sortOrder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.subscription = this.search(companyId, '', page, pageSize, sortOrder, true).subscribe((result: any) => {
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

  // returns all of object as collection
  public async getAll(companyId: string, page: number, pageSize: number) {
    let taskRunning: boolean = true;
    let data: PaymentCycle[] = [];

    while (taskRunning) {
      await this.promise(companyId, page, pageSize, 'asc').then(resolveResult => {
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

}

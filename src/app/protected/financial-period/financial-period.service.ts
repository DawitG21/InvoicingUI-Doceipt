import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';

import { FinancialPeriod } from '../../models/financial-period.model';
import { AuthService } from '../../core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';

import { FinancialPeriodNew } from '../../models/financial-period-new.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialPeriodService extends BaseService {

  accessToken = '';
  httpOptions: any;
  subscription: Subscription | any;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  get(id: string): Observable<FinancialPeriod> {
    return this.http.get(
      this.resEndpoint.FinancialPeriodGetUri(id), this.httpOptions
    ).pipe(map((response: any) => response), catchError(this.handleError));
  }

  search(companyId: string, searchText: any,
    page: number, pageSize: number, sortOrder: string, opened?: boolean): Observable<any> {
    const baseUrl = this.resEndpoint.FinancialPeriodUri;
    let searchUrl: string;

    if (opened) {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&opened=${opened}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    } else {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  create(newFinancialPeriod: FinancialPeriodNew): Observable<FinancialPeriodNew> {
    return this.http.post(
      this.resEndpoint.FinancialPeriodUri, newFinancialPeriod, this.httpOptions
    ).pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(financialPeriod: FinancialPeriod): Observable<FinancialPeriod> {
    return this.http.put(
      this.resEndpoint.FinancialPeriodUri, financialPeriod, this.httpOptions
    ).pipe(map((response: any) => response), catchError(this.handleError));
  }

  getInvoiceCount(id: string): Observable<FinancialPeriod[]> {
    return this.http.get(
      this.resEndpoint.FinancialPeriodGetInvoiceCountUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
  delete(id: string): Observable<FinancialPeriod> {
    return this.http.delete(this.resEndpoint.FinancialPeriodDeleteUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  void(id: string): Observable<FinancialPeriod> {
    return this.http.delete(this.resEndpoint.FinancialPeriodVoidUri(id), this.httpOptions)
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
    let data: FinancialPeriod[] = [];

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

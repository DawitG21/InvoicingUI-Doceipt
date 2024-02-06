import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseService } from 'src/app/shared/base.service';
import { AuthService } from '../../core/authentication/auth.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { ProtectedService } from '../protected.service';

import { CustomerGroup } from 'src/app/models/customer-group.model';
import { CustomerGroupNew } from 'src/app/models/customer-group-new.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService extends BaseService implements OnDestroy {

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


  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private promise(companyId: string, page: number, pageSize: number, sortOrder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.subscription = this.search(companyId, '', page, pageSize, sortOrder, false).subscribe((result: any) => {
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
    let data: CustomerGroup[] = [];

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

  public search(companyId: string, searchText: any,
    page: number, pageSize: number, sortOrder: string, importOnly: boolean, href?: string): Observable<any> {
    let searchUrl: string;

    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.CustomerGroupUri;
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&importOnly=${importOnly}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  searchCustomerGroup(companyId: string, searchText: any,
    page: number, pageSize: number, sortOrder: string, active?: boolean): Observable<any> {
    const baseUrl = this.resEndpoint.CustomerGroupUri;
    let searchUrl: string;

    if (active || active === false) {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&active=${active}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    } else {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  public get(id: string): Observable<CustomerGroup> {
    return this.http.get(this.resEndpoint.CustomerGroupGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public create(newCustomerGroup: CustomerGroupNew): Observable<CustomerGroupNew> {
    return this.http.post(this.resEndpoint.CustomerGroupUri, newCustomerGroup, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public update(customerGroup: CustomerGroup): Observable<CustomerGroup> {
    return this.http.put(this.resEndpoint.CustomerGroupUri, customerGroup, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public delete(id: string): Observable<CustomerGroup> {
    return this.http.delete(this.resEndpoint.CustomerGroupGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

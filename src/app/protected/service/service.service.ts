import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ProtectedService } from '../protected.service';

import { Service } from 'src/app/models/service.model';
import { ServiceNew } from 'src/app/models/service-new.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  httpOptions: any;
  subscription: Subscription | any;

  constructor(
    private resEndpoint: ResourceEndpointService,
    private http: HttpService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) {
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  search(companyId: string, searchText: any,
    page: number, pageSize: number, sortOrder: string, active?: boolean): Observable<any> {
    const baseUrl = this.resEndpoint.ServiceUri;
    let searchUrl: string;

    if (active || active === false) {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&active=${active}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    } else {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  create(newService: ServiceNew): Observable<Service> {
    return this.http.post(this.resEndpoint.ServiceUri, newService, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  update(service: Service): Observable<Service> {
    return this.http.put(this.resEndpoint.ServiceUri, service, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  delete(id: string): Observable<Service> {
    return this.http.delete(this.resEndpoint.ServiceDeleteUri(id), this.httpOptions)
      .pipe(map((response: any) => response));
  }

  private promise(companyId: string, page: number, pageSize: number, sortOrder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.subscription = this.search(companyId, '', page, pageSize, sortOrder).subscribe((result: any) => {
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
    let data: Service[] = [];

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

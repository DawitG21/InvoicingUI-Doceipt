import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../../core/authentication/auth.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';

import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';
import { HttpService } from 'src/app/providers/http.service';

import { Branch } from 'src/app/models/branch.model';
import { BranchNew } from 'src/app/models/branch-new.model';
import { BranchEdit } from 'src/app/models/branch-edit.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseService implements OnDestroy {

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
    if(this.subscription && !this.subscription.closed) {
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
    let data: Branch[] = [];

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
    

  get(id: string): Observable<Branch> {
    return this.http.get(this.resEndpoint.BranchGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  search(companyId: string, searchText: any,
    page: number, pageSize: number, sortOrder: string, importOnly: boolean, href?: string): Observable<any> {
    let searchUrl: string;

    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.BranchUri;
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&importOnly=${importOnly}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(newBranch: BranchNew): Observable<Branch> {
    return this.http.post(this.resEndpoint.BranchUri, newBranch, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(branch: BranchEdit): Observable<Branch> {
    return this.http.put(this.resEndpoint.BranchUri, branch, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<Branch> {
    return this.http.delete(this.resEndpoint.BranchGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from 'src/app/providers/http.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { ProtectedService } from '../protected.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { BaseService } from 'src/app/shared/base.service';

import { User } from 'src/app/models/user.model';
import { RoleReport } from 'src/app/models/role-report.model';
import { Role } from 'src/app/models/role.model';
import { UserUpdate } from 'src/app/models/user-update.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  httpOptions: any;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private protectedService: ProtectedService,
    private authService: AuthService,
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  get(id: string): Observable<User> {
    return this.http.get(`${this.resEndpoint.UserUri}/${id}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  getUsers(companyId: string): Observable<User[]> {
    return this.http.get(`${this.resEndpoint.UserUri}/company/${companyId}/users`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  assignBranches(id: string, companyId: string, branchIds: string[]): Observable<any> {
    return this.http.post(`${this.resEndpoint.UserUri}/${id}/company/${companyId}/assignbranches`,
      branchIds, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string, companyId: string): Observable<any> {
    return this.http.delete(`${this.resEndpoint.UserUri}/${id}/company/${companyId}/deleteuser`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  deleteBranch(id: string, companyId: string, branchId: string): Observable<any> {
    return this.http.delete(`${this.resEndpoint.UserUri}/${id}/company/${companyId}/branch/${branchId}/deletebranch`,
      this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  getUserReport(companyId: string): Observable<RoleReport[]> {
    return this.http.get(`${this.resEndpoint.UserUri}/reports?companyid=${companyId}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  getUserRoles(companyId: string, userId: string): Observable<Role[]> {
    return this.http.get(`${this.resEndpoint.UserUri}/company/${companyId}/roles?userid=${userId}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  addOwner(user: UserUpdate): Observable<any> {
    return this.http.put(`${this.resEndpoint.UserUri}/addowner`, user, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  addPrincipalOwner(user: UserUpdate): Observable<any> {
    return this.http.put(`${this.resEndpoint.UserUri}/addPrincipalOwner`, user, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  isModelValid(user: any): boolean {
    return !(!user.name || user.name.trim() === '');
  }

}

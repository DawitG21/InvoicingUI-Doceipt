import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from 'src/app/providers/http.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';

import { Role } from 'src/app/models/role.model';
import { RoleNew } from 'src/app/models/role-new.model';
import { RoleReport } from 'src/app/models/role-report.model';
import { Claim } from 'src/app/models/claim.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseService {
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

  public get(id: string): Observable<Role> {
    return this.http.get(this.resEndpoint.RoleGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public getAll(companyId: string): Observable<Role[]> {
    return this.http.get(this.resEndpoint.RoleAllUri(companyId), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public create(newRole: RoleNew): Observable<Role> {
    return this.http.post(this.resEndpoint.RoleUri, newRole, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public update(role: Role): Observable<Role> {
    return this.http.put(this.resEndpoint.RoleUri, role, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public delete(id: string): Observable<Role> {
    return this.http.delete(this.resEndpoint.RoleGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public getReports(companyId: string, roleId?: string): Observable<RoleReport[]> {
    let url = this.resEndpoint.RoleUri + '/reports?';
    if (roleId) {
      url = `${url}roleid=${roleId}&companyid=${companyId}`;
    } else {
      url = `${url}companyid=${companyId}`;
    }
    return this.http.get(url, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public getClaims(companyId: string, roleId?: string): Observable<Claim[]> {
    let url = this.resEndpoint.RoleUri + '/claims?';
    if (roleId) {
      url = `${url}roleid=${roleId}&companyid=${companyId}`;
    } else {
      url = `${url}companyid=${companyId}`;
    }
    return this.http.get(url, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

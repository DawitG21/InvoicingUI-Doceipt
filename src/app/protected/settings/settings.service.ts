import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProtectedService } from '../protected.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { HttpService } from 'src/app/providers/http.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';

import { Permission } from 'src/app/models/permission.model';
import { PermissionNew } from 'src/app/models/permission-new.model';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  constructor(
    private resEndpoint: ResourceEndpointService,
    private http: HttpService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) { }

  getAllPermission(companyId: string): Observable<Permission[]> {
    return this.http.get(this.resEndpoint.PermissionGetAllUri(companyId),
      this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue))
      .pipe(map((response: any) => response));
  }

  createPermission(newPermission: PermissionNew): Observable<Permission> {
    return this.http.post(this.resEndpoint.PermissionUri, newPermission,
      this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue))
      .pipe(map((response: any) => response));
  }

  updatePermission(permission: Permission): Observable<Permission> {
    return this.http.put(this.resEndpoint.PermissionUri, permission,
      this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue))
      .pipe(map((response: any) => response));
  }

  deletePermission(id: string): Observable<any> {
    return this.http.delete(this.resEndpoint.PermissionDeleteUri(id),
      this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue));
  }

}

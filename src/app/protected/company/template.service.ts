import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from 'src/app/providers/http.service';
import { ProtectedService } from '../protected.service';
import { AuthService } from 'src/app/core/authentication/auth.service';

import { BaseService } from 'src/app/shared/base.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';

import { Template } from 'src/app/models/template.model';

@Injectable({
  providedIn: 'root',
})
export class TemplateService extends BaseService {
  public httpOptions: any;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private protectedService: ProtectedService,
    private authService: AuthService,
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  public search(page: number, pageSize: number, sortOrder: string, companyId?: string, searchText?: string, href?: string): Observable<Template> {
    let searchUrl: string;
    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.TemplateUri;
      searchUrl = `${baseUrl}/search?companyId=${companyId}&searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }
    return this.http.get(searchUrl, this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue))
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseService } from 'src/app/shared/base.service';
import { AuthService } from '../../core/authentication/auth.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { ProtectedService } from '../protected.service';

import { ConnectorNew } from 'src/app/models/connector-new.model';
import { Connector } from 'src/app/models/connector.model';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService extends BaseService {

  httpOptions: any;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  search(companyId: string, searchText: any,
    page: number, pageSize: number, sortOrder: string, href?: string): Observable<any> {
    let searchUrl: string;

    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.ConnactorUri;
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}
      &page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  searchFlag(searchText: any,
    page: number, pageSize: number, sortOrder: string, href?: string): Observable<any> {
    let searchUrl: string;

    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.FlagUri;
      searchUrl = `${baseUrl}?searchText=${searchText}
      &page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(newConnector: ConnectorNew): Observable<ConnectorNew> {
    return this.http.post(this.resEndpoint.ConnactorUri, newConnector, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(connector: Connector): Observable<Connector> {
    return this.http.put(this.resEndpoint.ConnactorUri, connector, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<Connector> {
    return this.http.delete(this.resEndpoint.ConnectorGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  renewApiKey(id: string): Observable<Connector> {
    let renewUrl: string;
    const baseUrl = this.resEndpoint.ConnectorGetUri(id);
    renewUrl = `${baseUrl}/renewapikey`;

    return this.http.get(renewUrl, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

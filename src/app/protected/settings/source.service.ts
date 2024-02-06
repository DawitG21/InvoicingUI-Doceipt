import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from '../../core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';

import { Source } from 'src/app/models/source.model';
import { SourceNew } from 'src/app/models/source-new.model';

@Injectable({
  providedIn: 'root'
})
export class SourceService extends BaseService {

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

  get(id: string): Observable<Source> {
    return this.http.get(this.resEndpoint.SourceGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  getAll(companyId: string): Observable<Source[]> {
    return this.http.get(this.resEndpoint.SourceAllUri(companyId), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(newSource: SourceNew): Observable<SourceNew> {
    return this.http.post(this.resEndpoint.SourceUri, newSource, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(source: Source): Observable<Source> {
    return this.http.put(this.resEndpoint.SourceUri, source, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<Source> {
    return this.http.delete(this.resEndpoint.SourceGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

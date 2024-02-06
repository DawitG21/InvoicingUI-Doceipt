import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from 'src/app/providers/http.service';
import { ProtectedService } from '../protected.service';
import { AuthService } from 'src/app/core/authentication/auth.service';

import { BaseService } from 'src/app/shared/base.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';

import { CompanyDetail } from 'src/app/models/company-detail.model';
import { CompanyDetailNew } from 'src/app/models/company-detail-new.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyDetailService extends BaseService {
  httpOptions: any;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private protectedService: ProtectedService,
    private authService: AuthService
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  get(id: string): Observable<CompanyDetail> {
    return this.http.get(`${this.resEndpoint.CompanyDetailUri}/${id}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  getForCompany(companyId: string): Observable<CompanyDetail> {
    return this.http.get(`${this.resEndpoint.CompanyDetailUri}/${companyId}/get`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(newCompanyDetail: CompanyDetailNew): Observable<CompanyDetail> {
    return this.http.post(this.resEndpoint.CompanyDetailUri, newCompanyDetail, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(companyDetail: CompanyDetail): Observable<CompanyDetail> {
    return this.http.put(this.resEndpoint.CompanyDetailUri, companyDetail, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

}

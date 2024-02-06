import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { HttpService } from 'src/app/providers/http.service';
import { ProtectedService } from '../protected.service';
import { AuthService } from '../../core/authentication/auth.service';
import { BaseService } from 'src/app/shared/base.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';

import { CompanyNew } from 'src/app/models/company-new.model';
import { Company } from 'src/app/models/company.model';
import { TemplateAdd } from 'src/app/models/template-add.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseService {

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

  public create(newCompany: CompanyNew): Observable<Company> {
    return this.http.post(this.resEndpoint.CompanyUri, newCompany, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public get(id: string): Observable<Company> {
    return this.http.get(`${this.resEndpoint.CompanyUri}/${id}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
  public sentMessage(id: string): Observable<any> {
    return this.http.get(`${this.resEndpoint.MessageUri}/${id}/send`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public getAll(): Observable<any> {
    return this.http.get(this.resEndpoint.CompanyUri, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public addTemplate(model: TemplateAdd): Observable<any> {
    return this.http.post(this.resEndpoint.CompanyTemplateAddUri, model, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

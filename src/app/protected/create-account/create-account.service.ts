import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ProtectedService } from '../protected.service';

import { CompanyNew } from 'src/app/models/company-new.model';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {
  token = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) { }

  signup(newCompany: CompanyNew): Observable<any> {
    return this.http.post(this.resEndpoint.AccountUri, newCompany, this.token)
      .pipe(map((response: any) => response));
  }

  createCompany(newCompany: CompanyNew): Observable<any> {
    return this.http.post(this.resEndpoint.CompanyUri, newCompany, this.token)
      .pipe(map((response: any) => response));
  }
}

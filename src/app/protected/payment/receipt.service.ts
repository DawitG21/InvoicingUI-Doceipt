import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from 'src/app/providers/http.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService extends BaseService {
  httpOptions: any;

  constructor(
    private resEndpoint: ResourceEndpointService,
    private http: HttpService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  void(id: string): Observable<any> {
    return this.http.delete(this.resEndpoint.ReceiptByIDUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(receipt: any): Observable<any> {
    return this.http.put(this.resEndpoint.ReceiptUri, receipt, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

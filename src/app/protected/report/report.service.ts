import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { HttpService } from 'src/app/providers/http.service';
import { ReportEndpointService } from 'src/app/endpoints/report-endpoint.service';
import { ProtectedService } from '../protected.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { StorageService } from 'src/app/providers/storage.service';
import { BaseService } from 'src/app/shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {

  readonly httpOptions: any;
  readonly companyId: string;

  constructor(
    private http: HttpService,
    private endpoint: ReportEndpointService,
    private protectedService: ProtectedService,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
    this.companyId = this.storageService.getCompanyId;
  }

  invoiceDueReport(reportFilter: any): Observable<any> {
    return this.http.post(this.endpoint.invoice_due_100Uri(this.companyId), reportFilter, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  invoicePaidReport(reportFilter: any): Observable<any> {
    return this.http.post(this.endpoint.invoice_paid_101Uri(this.companyId), reportFilter, this.httpOptions)
      .pipe(map((response: any) => response));
  }

  pdfReport(reportFilter: any, reportCode: string): Observable<any> {
    return this.http.post(this.endpoint.reporter(this.companyId, reportCode), reportFilter, this.httpOptions)
      .pipe(timeout(180000), map((response: any) => response), catchError(this.handleError));
  }

}

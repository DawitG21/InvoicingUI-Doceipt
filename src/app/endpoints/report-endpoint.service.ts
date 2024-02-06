import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/config.service';

@Injectable({
  providedIn: 'root'
})
export class ReportEndpointService {

  constructor(
    private configService: ConfigService
  ) { }

  invoice_due_100Uri(companyId: string): string {
    return `${this.configService.resourceApiServiceURI}/report/${companyId}/code/100`;
  }

  invoice_paid_101Uri(companyId: string): string {
    return `${this.configService.resourceApiServiceURI}/report/${companyId}/code/101`;
  }

  reporter(companyId: string, code: string): string {
    return `${this.configService.resourceApiServiceURI}/report?companyId=${companyId}&code=${code}`;
  }
}

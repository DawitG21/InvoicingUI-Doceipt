import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { Penalty } from 'src/app/models/penalty';
import { PenaltyNew } from 'src/app/models/penalty-new.model';
import { PenaltySearch } from 'src/app/models/penalty-search.model';
import { HttpService } from 'src/app/providers/http.service';
import { BaseService } from 'src/app/shared/base.service';
import { ProtectedService } from '../protected.service';

@Injectable({
  providedIn: 'root'
})
export class PenaltyService extends BaseService{

  accessToken = '';
  httpOptions: any;
  subscription: Subscription | any;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) { 
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  get(id: string): Observable<Penalty> {
    return this.http.get(
      this.resEndpoint.PenaltyGetUri(id), this.httpOptions
    ).pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(newPenalty: PenaltyNew): Observable<PenaltyNew> {
    return this.http.post(
      this.resEndpoint.PenaltyUri, newPenalty, this.httpOptions
    ).pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<Penalty> {
    return this.http.delete(this.resEndpoint.PenaltyDeleteUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  public search(companyId: string, searchText: any, model: PenaltySearch,
    page: number, pageSize: number, sortOrder: string, href?: string): Observable<any> {
    let searchUrl: string;

    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.PenaltyUri;
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.post(searchUrl, model, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }
}

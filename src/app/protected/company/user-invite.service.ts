import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseService } from 'src/app/shared/base.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { ProtectedService } from '../protected.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { HttpService } from 'src/app/providers/http.service';

import { UserInvite } from 'src/app/models/user-invite.model';
import { UserInviteNew } from 'src/app/models/user-invite-new.model';

@Injectable({
  providedIn: 'root'
})
export class UserInviteService extends BaseService {
  httpOptions: any;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private protectedService: ProtectedService,
    private authService: AuthService,
  ) {
    super();

    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }


  get(id: string): Observable<UserInvite> {
    return this.http.get(`${this.resEndpoint.UserInviteUri}/${id}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  getSentInvites(companyId: string): Observable<UserInvite[]> {
    return this.http.get(`${this.resEndpoint.UserInviteUri}/${companyId}/sentinvites`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  getReceivedInvites(): Observable<UserInvite[]> {
    return this.http.get(`${this.resEndpoint.UserInviteUri}/receivedinvites`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(newUserInvite: UserInviteNew): Observable<UserInvite> {
    return this.http.post(this.resEndpoint.UserInviteUri, newUserInvite, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  accept(id: string): Observable<UserInvite> {
    return this.http.post(`${this.resEndpoint.UserInviteUri}/${id}/accept`, null, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.resEndpoint.UserInviteUri}/${id}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  isModelValid(userInvite: any): boolean {
    return !(!userInvite.username || userInvite.username.trim() === '');
  }

}

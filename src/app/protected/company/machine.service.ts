import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpService } from 'src/app/providers/http.service';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { ProtectedService } from '../protected.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';
import { BaseService } from 'src/app/shared/base.service';

import { Machine } from 'src/app/models/machine.model';
import { MachineNew } from 'src/app/models/machine-new.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService extends BaseService {

  httpOptions: any;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private protectedService: ProtectedService,
    private authService: AuthService,
    private toastService: ToastService,
    private messageService: MessageService
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  get(id: string): Observable<Machine> {
    return this.http.get(`${this.resEndpoint.MachineUri}/${id}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  search(companyId: string, searchText: any,
    page: number, pageSize: number, sortOrder: string, active?: boolean): Observable<any> {
    const baseUrl = this.resEndpoint.MachineUri;
    let searchUrl: string;

    if (active || active === false) {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&active=${active}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    } else {
      searchUrl = `${baseUrl}/${companyId}/search?searchText=${searchText}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }

    return this.http.get(searchUrl, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(newMachine: MachineNew): Observable<Machine> {
    return this.http.post(this.resEndpoint.MachineUri, newMachine, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  update(machine: Machine): Observable<Machine> {
    return this.http.put(this.resEndpoint.MachineUri, machine, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.resEndpoint.MachineUri}/${id}`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  isModelValid(machine: any): boolean {
    if (!machine.name || machine.name.trim() === '' ||
      !machine.machineNo || machine.machineNo.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return false;
    }

    return true;
  }

}

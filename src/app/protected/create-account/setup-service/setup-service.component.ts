import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ServiceNew } from 'src/app/models/service-new.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { ServiceService } from '../../service/service.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

@Component({
  selector: 'app-setup-service',
  styleUrls: ['./setup-service.component.scss'],
  templateUrl: './setup-service.component.html',
})
export class SetupServiceComponent implements OnInit {

  public form = new FormGroup({
    companyId: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    isActive: new FormControl([Validators.required]),
    mandatory: new FormControl([Validators.required]),
    name: new FormControl('', [Validators.required]),
    orderNo: new FormControl([Validators.required]),
  });
  public model: ServiceNew | any;
  public companyID: string = '';
  public message: string = '';
  public status: boolean = false;
  public messageMandatory: string = '';
  public mandatory: boolean = false;
  public busy: boolean = false;

  constructor(
    public route: Router,
    private serviceService: ServiceService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private messageService: MessageService,
  ) {
  }

  public ngOnInit() {
    this.companyID = this.storageService.getCompanyId;
    this.model = new ServiceNew(this.companyID);
    this.model.companyId = this.companyID;
    this.form.get('companyId')!.setValue(this.model.companyId);
    this.form.get('isActive')!.setValue(this.model.isActive);
    this.form.get('mandatory')!.setValue(this.model.mandatory);
    this.form.get('orderNo')!.setValue(this.model.orderNo);
    this.setStatus(this.model.isActive);
    this.setMandatory(this.model.mandatory);
  }

  public setStatus(e: any) {
    if (e) {
      this.message = 'Active';
      this.status = true;
    } else {
      this.message = 'Inactive';
      this.status = false;
    }
  }

  public setMandatory(e: any) {
    if (e) {
      this.messageMandatory = 'Mandatory';
      this.mandatory = true;
    } else {
      this.messageMandatory = 'Optional';
      this.mandatory = false;
    }
  }

  private addService(service: ServiceNew): Promise<any> {
    return this.serviceService.create(service).toPromise();
  }

  public save() {
    this.model = this.form.value as ServiceNew;
    if (this.model.companyId === '' ||
      this.model.name === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addService(this.model).then(() => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.route.navigate(['protected/create-account/setup-service-fee']);
    }, (reject) => {
      this.toastService.error(reject);
    })
      .catch((error) => {
        this.toastService.error(error);
      })
      .finally(() => {
        this.busy = false;
      });

  }

  public skipToDashboard() {
    const message = new BroadcastMessage('show-navs');
    this.broadcastService.broadcastTask(message);
    this.route.navigate(['/protected/dashboard']);
  }

}

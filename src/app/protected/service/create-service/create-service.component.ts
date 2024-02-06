import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { ServiceNew } from 'src/app/models/service-new.model';

import { ServiceService } from '../service.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { ToastService } from 'src/app/providers/toast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})

export class CreateServiceComponent implements OnInit {

  model: ServiceNew | any;
  companyId: string = '';
  message: string = '';
  messageOptional: string = '';
  status: boolean = false;
  state: boolean = false;
  subscription: Subscription;
  public busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'orderNo': new FormControl('', [Validators.required]),
    'description': new FormControl,
    'mandatory': new FormControl(false),
    'isActive': new FormControl(true)
  });

  getErrorMessage(field: string) {
    return this.form.get(field)!.hasError('required') ? 'You must enter a value' : '';
  }

  get getServiceName() {
    return this.form.get('name');
  }

  get getOrderNo() {
    return this.form.get('orderNo');
  }

  constructor(
    public router: Router,
    private serviceService: ServiceService,
    private toastService: ToastService,
    private location: Location,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    private storageService: StorageService,
  ) {
    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.router.navigate(['/protected/service']);
        }
      });

  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.initForm();
    this.form.get('companyId')!.setValue(this.companyId);
    this.setActive(this.model.isActive);
    this.setMandatory(this.model.mandatory);
  }

  initForm() {
    this.model = new ServiceNew(this.companyId);
  }

  setActive(e: any) {
    if (e) {
      this.message = 'Active';
      this.status = true;
    } else {
      this.message = 'Inactive';
      this.status = false;
    }
  }

  setMandatory(e: any) {
    if (e) {
      this.messageOptional = 'Service is mandatory';
      this.state = true;
    } else {
      this.messageOptional = 'Service is optional';
      this.state = false;
    }
  }

  public create(model: ServiceNew): Promise<any> {
    return this.serviceService.create(model).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as ServiceNew;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.create(this.model).then(() => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
    }, (reject) => {
      this.toastService.error(reject);
      this.saveStatus = false;
    })
      .catch((error) => {
        this.toastService.error(error);
        this.saveStatus = false;
      })
      .finally(() => {
        this.busy = false;
        this.saveStatus = false;
      });
  }

  goBack() {
    this.location.back();
  }

}

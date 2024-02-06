import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { ServiceService } from '../service.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import { Service } from 'src/app/models/service.model';

import { BroadcastMessage } from 'src/app/models/broadcast-message';

@Component({
  selector: 'app-update-service',
  templateUrl: './update-service.component.html',
  styleUrls: ['./update-service.component.scss']
})

export class UpdateServiceComponent implements OnInit, OnDestroy {

  model: Service;
  subscription: Subscription;
  message: string = '';
  messageOptional: string = '';
  status: boolean = false;
  state: boolean = false;
  public busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'id': new FormControl(''),
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'orderNo': new FormControl('', [Validators.required]),
    'description': new FormControl,
    'mandatory': new FormControl,
    'isActive': new FormControl
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
    private serviceService: ServiceService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private location: Location,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.model = this.storageService.getData('data');
    this.populateData(this.model);
    // this.form.get('id')!.setValue(this.model.id);
    // this.form.get('name')!.setValue(this.model.name);
    // this.form.get('orderNo')!.setValue(this.model.orderNo);
    // this.form.get('description')!.setValue(this.model.description);
    // this.form.get('mandatory')!.setValue(this.model.mandatory);
    // this.form.get('isActive')!.setValue(this.model.isActive);

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.router.navigate(['/protected/service']);
        }
      });
  }

  ngOnInit() {
    this.setActive(this.model.isActive);
    this.setMandatory(this.model.mandatory);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public populateData(arg: Service) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('orderNo')!.setValue(arg.orderNo);
    this.form.get('description')!.setValue(arg.description);
    this.form.get('mandatory')!.setValue(arg.mandatory);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.markAsUntouched();
  }

  public update(model: Service): Promise<any> {
    return this.serviceService.update(model).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as Service;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }
    this.update(this.model).then((result: Service) => {
      this.populateData(result);
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

  goBack() {
    this.router.navigate(['/protected/service']);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { BroadcastService } from 'src/app/providers/broadcast.service';
import { ToastService } from 'src/app/providers/toast.service';
import { PaymentMethodService } from '../payment-method.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import { PaymentMethodNew } from 'src/app/models/payment-method-new.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

@Component({
  selector: 'app-create-payment-method',
  templateUrl: './create-payment-method.component.html',
  styleUrls: ['./create-payment-method.component.scss']
})

export class CreatePaymentMethodComponent implements OnInit {

  companyId: string = '';
  model: PaymentMethodNew | any;
  subscription: Subscription;
  message: string = '';
  status: boolean = false;
  public busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'orderNo': new FormControl('', [Validators.required]),
    'description': new FormControl,
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
    public route: Router,
    private paymentMethodService: PaymentMethodService,
    private toastService: ToastService,
    private location: Location,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.initForm();

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.router.navigate(['/protected/branch']);
        }
      });
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.form.get('companyId')!.setValue(this.companyId);
    this.setActive(this.model.isActive);
  }

  initForm() {
    this.model = new PaymentMethodNew(this.companyId);
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

  public create(model: PaymentMethodNew): Promise<any> {
    return this.paymentMethodService.createPaymentMethod(model).toPromise();
  }

  save(): void {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as PaymentMethodNew;
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

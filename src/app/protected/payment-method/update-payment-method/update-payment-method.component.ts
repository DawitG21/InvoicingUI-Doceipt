import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PaymentMethod } from 'src/app/models/payment-method.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { BroadcastService } from 'src/app/providers/broadcast.service';
import { ToastService } from 'src/app/providers/toast.service';
import { PaymentMethodService } from '../payment-method.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

@Component({
  selector: 'app-update-payment-method',
  templateUrl: './update-payment-method.component.html',
  styleUrls: ['./update-payment-method.component.scss']
})

export class UpdatePaymentMethodComponent implements OnInit, OnDestroy {

  model: PaymentMethod;
  subscription: Subscription;
  message: string = '';
  status: boolean = false;
  public busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'id': new FormControl(''),
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'orderNo': new FormControl('', [Validators.required]),
    'description': new FormControl,
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
    private paymentMethodService: PaymentMethodService,
    private toastService: ToastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private broadcastService: BroadcastService,
    private route: Router,
  ) {
    this.model = this.storageService.getData('data');
    this.populateData(this.model);

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.route.navigate(['/protected/payment-method']);
        }
      });
  }

  ngOnInit() {
    this.setActive(this.model.isActive);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public update(model: PaymentMethod): Promise<any> {
    return this.paymentMethodService.updatePaymentMethod(model).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as PaymentMethod;

    this.update(this.model).then((result: PaymentMethod) => {
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

  goBack() {
    this.route.navigate(['/protected/payment-method']);
  }

  public populateData(arg: PaymentMethod) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('orderNo')!.setValue(arg.orderNo);
    this.form.get('description')!.setValue(arg.description);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.markAsUntouched();
  }
}

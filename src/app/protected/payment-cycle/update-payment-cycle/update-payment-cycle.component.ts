import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastService } from 'src/app/providers/toast.service';
import { PaymentCycleService } from '../payment-cycle.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import { PaymentCycle } from 'src/app/models/payment-cycle.model';


@Component({
  selector: 'app-update-payment-cycle',
  templateUrl: './update-payment-cycle.component.html',
  styleUrls: ['./update-payment-cycle.component.scss']
})
export class UpdatePaymentCycleComponent implements OnInit {

  model: PaymentCycle;
  status: boolean = false;
  message: string = '';
  public busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'id': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'orderNo': new FormControl('', [Validators.required]),
    'description': new FormControl(''),
    'isActive': new FormControl,
  });

  constructor(
    private paymentCycleService: PaymentCycleService,
    private toastService: ToastService,
    private storageService: StorageService,
    private messageService: MessageService,
    public route: Router,
  ) {
    this.model = this.storageService.getData('data');
    this.populateData(this.model);
  }

  ngOnInit() {
    this.setStatus(this.model.isActive);
  }

  setStatus(e: any) {
    if (e) {
      this.message = 'Active';
      this.status = true;
    } else {
      this.message = 'Inactive';
      this.status = false;
    }
  }

  editPaymentCycle(paymentCycle: PaymentCycle): Promise<any> {
    return this.paymentCycleService.update(paymentCycle).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as PaymentCycle;
    this.editPaymentCycle(this.model).then((response: PaymentCycle) => {
      this.populateData(response);
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

  return() {
    this.route.navigate(['protected/payment-cycle']);
  }

  public populateData(arg: PaymentCycle) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('orderNo')!.setValue(arg.orderNo);
    this.form.get('description')!.setValue(arg.description);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.markAsUntouched();
  }
}

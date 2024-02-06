import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PaymentCycleNew } from 'src/app/models/payment-cycle-new.model';

import { PaymentCycleService } from '../payment-cycle.service';
import { ToastService } from 'src/app/providers/toast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

@Component({
  selector: 'app-create-payment-cycle',
  templateUrl: './create-payment-cycle.component.html',
  styleUrls: ['./create-payment-cycle.component.scss']
})
export class CreatePaymentCycleComponent implements OnInit {

  model: PaymentCycleNew | any;
  companyId: string = '';
  subscription: Subscription | any;
  message: string = '';
  status: boolean = false;
  public busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'orderNo': new FormControl('', [Validators.required]),
    'description': new FormControl(''),
    'isActive': new FormControl,
  });

  constructor(
    private paymentCycleService: PaymentCycleService,
    private toastService: ToastService,
    private location: Location,
    private storageService: StorageService,
    private messageService: MessageService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.form.get('companyId')!.setValue(this.companyId);
    this.form.get('isActive')!.setValue(this.model.isActive);
    this.setStatus(this.model.isActive);
  }

  initForm() {
    this.model = new PaymentCycleNew(this.companyId);
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

  addPaymentCycle(paymentCycle: PaymentCycleNew): Promise<any> {
    return this.paymentCycleService.create(paymentCycle).toPromise();
  }

  save() {
    this.busy = false;
    this.saveStatus = true;
    this.model = this.form.value as PaymentCycleNew;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }
    this.addPaymentCycle(this.model).then((result) => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
      this.initForm();
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

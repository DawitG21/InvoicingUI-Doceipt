import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PaymentCycleNew } from 'src/app/models/payment-cycle-new.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { PaymentCycleService } from '../../payment-cycle/payment-cycle.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

@Component({
  selector: 'app-setup-payment-cycle',
  styleUrls: ['./setup-payment-cycle.component.scss'],
  templateUrl: './setup-payment-cycle.component.html',
})
export class SetupPaymentCycleComponent implements OnInit {

  public form = new FormGroup({
    companyId: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    isActive: new FormControl([Validators.required]),
    name: new FormControl('', [Validators.required]),
    orderNo: new FormControl([Validators.required]),
  });
  public model: PaymentCycleNew | any;
  private companyId: string = '';
  public message: string = '';
  public status: boolean = false;
  public busy: boolean = false;

  constructor(
    public route: Router,
    private paymentCycleService: PaymentCycleService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private messageService: MessageService,
  ) {

  }

  public ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.model = new PaymentCycleNew(this.companyId);
    this.form.get('companyId')!.setValue(this.model.companyId);
    this.form.get('isActive')!.setValue(this.model.isActive);
    this.form.get('orderNo')!.setValue(this.model.orderNo);
    this.setStatus(this.model.isActive);
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

  private addPaymentCycle(paymentCycle: PaymentCycleNew): Promise<any> {
    return this.paymentCycleService.create(paymentCycle).toPromise();
  }

  public save() {
    this.busy = true;
    this.model = this.form.value as PaymentCycleNew;
    if (this.model.name === '' ||
      !this.model.orderNo) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addPaymentCycle(this.model).then(() => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.route.navigate(['protected/create-account/setup-service']);
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

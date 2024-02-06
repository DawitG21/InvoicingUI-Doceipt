import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  show: boolean;
}

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})

export class PaymentModalComponent implements OnInit {
  subscription: Subscription | any;
  model: any;
  paymentCycles: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public message: DialogData,
  ) {
    this.model = message;
    this.filterPaymentCycles();
  }

  ngOnInit() {
  }

  filterPaymentCycles() {
    for (let i = 0; i < this.model.message.invoice.invoiceFees.length; i++) {
      if (this.paymentCycles.length === 0) {
        this.paymentCycles.push(this.model.message.invoice.invoiceFees[i].paymentCycle);
      } else {
        let matched = 0;
        for (let j = 0; j < this.paymentCycles.length; j++) {
          if (this.model.message.invoice.invoiceFees[i].paymentCycle.id === this.paymentCycles[j].id) {
            matched = 1;
          }
        }
        if (matched === 0) {
          this.paymentCycles.push(this.model.message.invoice.invoiceFees[i].paymentCycle);
        }
      }
    }
  }

}

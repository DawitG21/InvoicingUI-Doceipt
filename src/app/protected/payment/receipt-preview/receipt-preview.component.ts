import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { StorageService } from 'src/app/providers/storage.service';
import { CompanyService } from '../../company/company.service';
import { HelperService } from 'src/app/providers/helper.service';
import { ToastService } from 'src/app/providers/toast.service';

import { Company } from 'src/app/models/company.model';
import { Receipt } from 'src/app/models/receipt.model';

import * as _ from 'lodash';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  show: boolean;
}

@Component({
  selector: 'app-receipt-preview',
  templateUrl: './receipt-preview.component.html',
  styleUrls: ['./receipt-preview.component.scss']
})

export class ReceiptPreviewComponent implements OnInit {
  subscription: Subscription | any;
  receipt: any;
  companyId: string = '';
  company: Company | any;
  subtotal = 0;
  total = 0;
  discount = 0;
  accrue: any;
  tax = 0;
  receiptObj: Receipt | any;
  logoUrl: string;
  receiptPiped: any = [];
  isPenalty: boolean = false;
  public busy: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ReceiptPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private storageService: StorageService,
    private companyService: CompanyService,
    private helperService: HelperService,
    private toastService: ToastService,
  ) {
    this.logoUrl = this.helperService.getAppLogo;
  }

  ngOnInit() {
    this.busy = true;
    this.receipt = this.data;
    console.log(this.receipt);
    if (this.receipt.message.invoice.penalty !== undefined) {
      this.isPenalty = true;
    }
    if (this.receipt.message.invoice.penalty !== undefined) {
      this.total = this.receipt.message.invoice.totalAmount + this.receipt.message.invoice.penalty;
    } else {
      this.total = this.receipt.message.invoice.totalAmount;
    }

    this.companyId = this.storageService.getCompanyId;

    this.getCompany(this.companyId).then((result: Company) => {
      this.company = result;
    }, (reject) => {
      this.toastService.error(reject);
    })
      .catch((error) => {
        this.toastService.error(error);
      })
      .finally(() => {
        this.busy = false;
      });

    this.receiptPiped = _.chain(this.receipt.message.data)
      .groupBy('paymentCycle.name')
      .map((value, key) => ({ key, value }))
      .value();
    this.calculateSubTotal();
    this.calculateDiscount();
    this.calculateTax();
  }

  public getCompany(companyId: string): Promise<any> {
    return this.companyService.get(companyId).toPromise();
  }

  calculateSubTotal() {
    this.subtotal = 0;
    if (this.receipt) {
      for (let i = 0; i < this.receipt.message.data.length; i++) {
        this.subtotal = this.subtotal + this.receipt.message.data[i].amountAfterQuantity;
      }
    }
  }

  calculateDiscount() {
    this.discount = 0;
    if (this.receipt) {
      for (let i = 0; i < this.receipt.message.data.length; i++) {
        for (let j = 0; j < this.receipt.message.data[i].invoiceFee.discountedAmounts.length; j++) {
          this.discount = this.discount + this.receipt.message.data[i].invoiceFee.discountedAmounts[j];
        }
      }
    }
  }

  calculateTax() {
    this.tax = 0;
    if (this.receipt) {
      for (let i = 0; i < this.receipt.message.data.length; i++) {
        for (let j = 0; j < this.receipt.message.data[i].netTaxes.length; j++) {
          this.tax = this.tax + this.receipt.message.data[i].netTaxes[j];
        }
      }
    }
  }

  selectActiveReceipt(receipts: any) {
    for (let i = 0; i < receipts.length; i++) {
      if (receipts[i].voided === false) {
        this.receiptObj = receipts[i];
        return;
      }
    }
  }

}

import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { Company } from 'src/app/models/company.model';

import { CompanyService } from '../../company/company.service';
import { StorageService } from 'src/app/providers/storage.service';
import { HelperService } from 'src/app/providers/helper.service';
import { ConsoleService } from 'src/app/providers/console.service';
import { ToastService } from 'src/app/providers/toast.service';

import * as _ from 'lodash';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  show: boolean;
}

@Component({
  selector: 'app-index-invoice-preview',
  templateUrl: './index-invoice-preview.component.html',
  styleUrls: ['./index-invoice-preview.component.scss']
})

export class IndexInvoicePreviewComponent implements OnInit, OnDestroy {

  subscription: Subscription | any;
  companyId: string = '';
  company: Company | any;
  customer: any;
  logoUrl: string;
  subtotal = 0;
  discount = 0;
  penalty = 0;
  tax = 0;
  invoice: any;
  invoicePiped: any = [];
  public busy: boolean = false;

  constructor(
    private storageService: StorageService,
    private companyService: CompanyService,
    private helperService: HelperService,
    private consoleService: ConsoleService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<IndexInvoicePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.logoUrl = this.helperService.getAppLogo;
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.getCompany();

    this.invoice = this.data;
    this.consoleService.consoleMessage(this.invoice);
    if (this.invoice.message.invoice.penalty) {
      this.penalty = this.invoice.message.invoice.penalty.accrue;
    }
    this.invoicePiped = _.chain(this.invoice.message.data)
      .groupBy('paymentCycle.name')
      .map((value, key) => ({ key, value }))
      .value();

    this.calculateSubTotal();
    this.calculateDiscount();
    this.calculateTax();

  }

  public get(companyId: string): Promise<any> {
    return this.companyService.get(companyId).toPromise();
  }

  public getCompany(): void {
    this.busy = true;
    this.get(this.companyId).then((result) => {
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
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  calculateSubTotal() {
    this.subtotal = 0;
    if (this.invoice) {
      for (let i = 0; i < this.invoice.message.data.length; i++) {
        this.subtotal = this.subtotal + this.invoice.message.data[i].amountAfterQuantity;
      }
    }
  }

  calculateDiscount() {
    this.discount = 0;
    if (this.invoice) {
      for (let i = 0; i < this.invoice.message.data.length; i++) {
        for (let j = 0; j < this.invoice.message.data[i].invoiceFee.discountedAmounts.length; j++) {
          this.discount = this.discount + this.invoice.message.data[i].invoiceFee.discountedAmounts[j];
        }
      }
    }
  }

  calculateTax() {
    this.tax = 0;
    if (this.invoice) {
      for (let i = 0; i < this.invoice.message.data.length; i++) {
        for (let j = 0; j < this.invoice.message.data[i].netTaxes.length; j++) {
          this.tax = this.tax + this.invoice.message.data[i].netTaxes[j];
        }
      }
    }
  }

}

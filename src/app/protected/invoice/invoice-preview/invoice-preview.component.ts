import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import * as _ from 'lodash';

import { CompanyService } from '../../company/company.service';
import { StorageService } from 'src/app/providers/storage.service';
import { HelperService } from 'src/app/providers/helper.service';
import { ConsoleService } from 'src/app/providers/console.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Company } from 'src/app/models/company.model';

export interface DialogData {
  show: boolean;
}

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})

export class InvoicePreviewComponent implements OnInit, OnDestroy {

  subscription: Subscription | any;
  subtotal: number | any;
  discount: number | any;
  tax: number | any;
  logoUrl: string;
  invoice: any;
  invoicePiped: any = [];
  companyId: string = '';
  company: Company | any;
  public busy: boolean = false;

  constructor(
    private consoleService: ConsoleService,
    private storageService: StorageService,
    private companyService: CompanyService,
    private helperService: HelperService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<InvoicePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.logoUrl = this.helperService.getAppLogo;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.getCompany();

    this.invoice = this.data;
    this.consoleService.consoleMessage(this.invoice);
    this.invoicePiped = _.chain(this.invoice.message.services)
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

  calculateSubTotal() {
    this.subtotal = 0;
    if (this.invoice) {
      for (let i = 0; i < this.invoice.message.services.length; i++) {
        this.subtotal = this.subtotal + this.invoice.message.services[i].amountAfterQuantity;
      }
    }
  }

  calculateDiscount() {
    this.discount = 0;
    if (this.invoice) {
      for (let i = 0; i < this.invoice.message.services.length; i++) {
        for (let j = 0; j < this.invoice.message.services[i].invoiceFee.discountedAmounts.length; j++) {
          this.discount = this.discount + this.invoice.message.services[i].invoiceFee.discountedAmounts[j];
        }
      }
    }
  }

  calculateTax() {
    this.tax = 0;
    if (this.invoice) {
      for (let i = 0; i < this.invoice.message.services.length; i++) {
        for (let j = 0; j < this.invoice.message.services[i].netTaxes.length; j++) {
          this.tax = this.tax + this.invoice.message.services[i].netTaxes[j];
        }
      }
    }
  }

}

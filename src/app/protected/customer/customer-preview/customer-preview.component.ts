import { Component, OnInit, Inject } from '@angular/core';

import { CustomerService } from '../customer.service';
import { ToastService } from 'src/app/providers/toast.service';
import { AuthService } from 'src/app/core/authentication/auth.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogConfirmData } from 'src/app/interfaces/dialog-confirm-data';

export interface DialogData {
  show: boolean;
}

@Component({
  selector: 'app-customer-preview',
  styleUrls: ['./customer-preview.component.scss'],
  templateUrl: './customer-preview.component.html',
})
export class CustomerPreviewComponent implements OnInit {

  customer: any;
  dueInvoices: any = [];
  public busy: boolean = false;
  claims: any;
  public isShow: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CustomerPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData,
    private customerService: CustomerService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
    this.customer = data.message;
  }

  ngOnInit() {
    this.claims = this.authService.userClaims;
    if (this.claims && this.claims.doceipt_claim_invoice_access) {
      this.getDueInvoices();
    }
  }

  public get(id: string): Promise<any> {
    return this.customerService.getDueInvoices(id).toPromise();
  }

  public show() {
    this.isShow = !this.isShow;
  }

  getDueInvoices() {
    this.busy = true;
    this.get(this.customer.id).then((result) => {
      this.dueInvoices = result;
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

  onNoClick(): void {
    this.dialogRef.close();
  }

}

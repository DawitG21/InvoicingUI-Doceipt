import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { InvoiceService } from '../invoice.service';

import { InvoiceFeeModified } from 'src/app/models/invoice-fee-modified.model';

import { IndexInvoicePreviewComponent } from '../index-invoice-preview/index-invoice-preview.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  show: boolean;
  customer: any;
  dueInvoices: [];
  message: any;
}

@Component({
  selector: 'app-customer-due-invoice',
  templateUrl: './customer-dueInvoice.component.html',
  styleUrls: ['./customer-dueInvoice.component.scss']
})

export class CustomerDueInvoiceComponent implements OnInit {

  subscription: Subscription | any;
  customer: any;
  dueInvoices: any[] = [];
  newInvoiceFee: InvoiceFeeModified | any;

  constructor(
    private invoiceService: InvoiceService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<IndexInvoicePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.customer = this.data.message.customer;
    this.dueInvoices = this.data.message.dueInvoices;

  }

  openDialog(invoice: any): void {
    const serviceFees = [];
    for (let i = 0; i < invoice.invoiceFees.length; i++) {
      this.newInvoiceFee = new InvoiceFeeModified(invoice.invoiceFees[i]);
      serviceFees.push(this.newInvoiceFee);
    }
    const broadCastMesage = this.invoiceService.invoicePreview(serviceFees, invoice);
    const dialogRef = this.dialog.open(IndexInvoicePreviewComponent, {
      width: '1000px',
      data: { show: true, message: broadCastMesage },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
    });
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

}

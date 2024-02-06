import { Component, Input, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BroadcastService } from 'src/app/providers/broadcast.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-invoice-carousel',
  styleUrls: ['./invoice-carousel.component.scss'],
  templateUrl: './invoice-carousel.component.html',
})
export class InvoiceCarouselComponent implements OnInit {

  public invoices: any[] = [];
  public panelOpenState = false;
  @Input() showSelectBtn: boolean = false;
  @Input() invoiceList: any;

  constructor(
    public dialogRef: MatDialogRef<InvoiceCarouselComponent>,
    public dialog: MatDialog,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    public toastService: ToastService,
    // private storageService: StorageService,
  ) {
    // this.invoices = this.storageService.getData('data');
  }

  public ngOnInit(): void {
    // console.log(this.invoiceList);
  }

  public selectInvoice(invoice: any) {
    if (!invoice.customer.isActive) {
      this.openCustomerInactiveDialog(invoice);
    } else {
      const message = new BroadcastMessage(this.messageService.invoiceSelectSender, invoice);
      this.broadcastService.broadcastTask(message);
      this.invoices = [];
      this.dialogRef.close();
    }
  }

  public openCustomerInactiveDialog(invoice: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: true,
        message: `The customer of the invoice you selected is not active! Do you wish to proceed?`,
      },
      disableClose: true,
      maxWidth: '620px',
      minWidth: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const message = new BroadcastMessage(this.messageService.invoiceSelectSender, invoice);
        this.broadcastService.broadcastTask(message);
        this.invoices = [];
        this.dialogRef.close();
      }
    });
  }

}

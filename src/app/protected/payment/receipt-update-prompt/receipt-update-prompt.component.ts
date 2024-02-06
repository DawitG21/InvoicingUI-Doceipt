import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BroadcastService } from 'src/app/providers/broadcast.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';
import { InvoiceService } from '../../invoice/invoice.service';
import { ReceiptService } from '../receipt.service';

import { ReceiptUpdate } from 'src/app/models/receipt-update.model';

export interface DialogData {
  show: boolean;
}

@Component({
  selector: 'app-receipt-update-prompt',
  templateUrl: './receipt-update-prompt.component.html',
  styleUrls: ['./receipt-update-prompt.component.scss']
})

export class ReceiptUpdatePromptComponent implements OnInit {
  subscription: Subscription | any;
  model: ReceiptUpdate;
  invoiceObj: any;
  public busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'id': new FormControl('', [Validators.required]),
    'fsNumber': new FormControl('', [Validators.required]),
    'machine': new FormControl(null),
    'remark': new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<ReceiptUpdatePromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    private toastService: ToastService,
    private invoiceService: InvoiceService,
    private receiptService: ReceiptService
  ) {
    this.model = new ReceiptUpdate();
    this.invoiceObj = data;
    this.model.id = this.invoiceObj.message.receipt.id;
    this.form.get('id')!.setValue(this.model.id);
    if (this.invoiceObj.message.machines && this.invoiceObj.message.machines.length > 0) {
      this.form.get('machine')!.setValue(this.invoiceObj.message.machines[0]);
    }
  }

  ngOnInit() {
  }

  public getInvoice(id: string): Promise<any> {
    return this.invoiceService.get(id).toPromise();
  }

  public update(model: ReceiptUpdate): Promise<any> {
    return this.receiptService.update(model).toPromise();
  }

  updateReceipt() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as ReceiptUpdate;
    if (!this.model.fsNumber || this.model.fsNumber === '') {
      this.toastService.warning('FS Number cannot be empty');
      return;
    }

    this.update(this.model).then((result) => {
      this.toastService.success('Operation Sucessful');
      this.getInvoice(result.invoice.id).then((res) => {
        const message = new BroadcastMessage(this.messageService.invoiceUpdatedSender, res);
        this.broadcastService.broadcastTask(message);
        this.saveStatus = false;
        this.dialogRef.close();
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

}

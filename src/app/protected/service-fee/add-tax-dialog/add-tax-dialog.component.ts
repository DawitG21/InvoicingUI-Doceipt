import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogConfirmData } from 'src/app/interfaces/dialog-confirm-data';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { ServiceFee } from 'src/app/models/service-fee.model';
import { Tax } from 'src/app/models/tax.model';

import { BroadcastService } from 'src/app/providers/broadcast.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';
import { ServiceFeeService } from '../service-fee.service';

@Component({
  selector: 'app-add-tax-dialog',
  styleUrls: ['./add-tax-dialog.component.scss'],
  templateUrl: './add-tax-dialog.component.html',
})
export class AddTaxDialogComponent implements OnInit {

  public busy: boolean = false;
  public taxes: Tax[];
  public form = new FormGroup({
    serviceFeeId: new FormControl(null, [Validators.required]),
    taxId: new FormControl(null, [Validators.required]),
  });

  constructor(
    private serviceFeeService: ServiceFeeService,
    private toastService: ToastService,
    private messageService: MessageService,
    private broadcastService: BroadcastService,
    public dialogRef: MatDialogRef<AddTaxDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData,
  ) {
    this.taxes = data.input.tax;
    this.form.get('serviceFeeId')!.setValue(data.input.id);
  }

  public ngOnInit(): void {
  }

  public serviceFeeTaxs(serivceFeeId: string, taxId: string): Promise<any> {
    return this.serviceFeeService.addServiceFeeTax(serivceFeeId, taxId).toPromise();
  }

  public save() {
    this.busy = true;
    const serviceFeeId = this.form.get('serviceFeeId')!.value;
    const taxId = this.form.get('taxId')!.value;
    if (serviceFeeId === null || taxId === null) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.serviceFeeTaxs(serviceFeeId, taxId).then((response: ServiceFee) => {
      this.toastService.success(this.messageService.operationSuccesful);
      const broadcastMessage = new BroadcastMessage(this.messageService.serviceFeeTaxAdded, response.taxes);
      this.broadcastService.broadcastTask(broadcastMessage);
      this.dialogRef.close();
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

}

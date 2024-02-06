import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogConfirmData } from 'src/app/interfaces/dialog-confirm-data';

import { BillingAddress } from 'src/app/models/billing-address.model';
import { BillingAddressNew } from 'src/app/models/billing-address-new.model';
import { BillingAddressUpdate } from 'src/app/models/billing-address-update.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { BillingAddressService } from '../billing-address.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';

@Component({
  selector: 'app-billing-address-dialog',
  styleUrls: ['./billing-address-dialog.component.scss'],
  templateUrl: './billing-address-dialog.component.html',
})
export class BillingAddressDialogComponent implements OnInit {

  public isUpdate: boolean = false;
  public model: any;
  public busy: boolean = false;
  public billingAddress: BillingAddress | any;
  public form = new FormGroup({
    contactId: new FormControl('', [Validators.required]),
    customerId: new FormControl('', [Validators.required]),
    id: new FormControl(null),
    primaryEmail: new FormControl(null, [Validators.required]),
    primaryPhone: new FormControl(null, [Validators.required]),
    relationship: new FormControl(null, [Validators.required]),
  });

  constructor(
    private billingAddressService: BillingAddressService,
    private messageService: MessageService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    public dialogRef: MatDialogRef<BillingAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData,
  ) {
    if (data.message === this.messageService.billingAddressAddSender) {
      this.billingAddress = data.input.billingAddress;
      this.form.get('contactId')!.setValue(this.billingAddress.contact.id);
      this.form.get('customerId')!.setValue(data.input.customerId);
    } else if (data.message === this.messageService.billingAddressUpdateSender) {
      // billing address update
      this.isUpdate = true;
      this.billingAddress = data.input.billingAddress;
      this.form.get('contactId')!.setValue(this.billingAddress.contact.id);
      this.form.get('customerId')!.setValue(data.input.customerId);
      this.form.get('id')!.setValue(this.billingAddress.id);
      this.form.get('primaryEmail')!.setValue(this.billingAddress.primaryEmail);
      this.form.get('primaryPhone')!.setValue(this.billingAddress.primaryPhone);
      this.form.get('relationship')!.setValue(this.billingAddress.relationship);
    }
  }

  public ngOnInit(): void {
  }

  public addOrUpdateBillingAddress(billingAddress: any, action: string): Promise<any> {
    if (action === 'create') {
      return this.billingAddressService.create(billingAddress).toPromise();
    }
    
    return this.billingAddressService.update(billingAddress).toPromise();
  }

  public save() {
    this.busy = true;
    let action = '';
    if (this.form.get('id')!.value === null) {
      this.model = this.form.value as BillingAddressNew;
      action = 'create';
    } else {
      // covert form value to BillingAddressUpdate
      action = 'update';
      this.model = this.form.value as BillingAddressUpdate;
    }
    if (this.model && this.model.primaryEmail === null ||
      this.model.primaryPhone === null ||
      this.model.relationship === null) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addOrUpdateBillingAddress(this.model, action).then((response) => {
      if (action === 'create') {
        const broadcastMessage = new BroadcastMessage(this.messageService.billingAddressAdded, response);
        this.broadcastService.broadcastTask(broadcastMessage);
        this.dialogRef.close();
      } else {
        const broadcastMessage = new BroadcastMessage(this.messageService.billingAddressUpdated, response);
        this.broadcastService.broadcastTask(broadcastMessage);
        this.dialogRef.close();
      }
      this.toastService.success(this.messageService.operationSuccesful);
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

  public cancel() {
    this.dialogRef.close();
  }

}

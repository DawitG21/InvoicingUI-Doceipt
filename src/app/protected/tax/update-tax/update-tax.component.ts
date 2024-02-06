import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastService } from 'src/app/providers/toast.service';
import { TaxService } from '../tax.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import { Tax } from 'src/app/models/tax.model';

@Component({
  selector: 'app-update-tax',
  templateUrl: './update-tax.component.html',
  styleUrls: ['./update-tax.component.scss']
})

export class UpdateTaxComponent implements OnInit {

  model: Tax;
  status: boolean = false;
  message: string = '';
  busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'id': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'percentValue': new FormControl(null, [Validators.required]),
    'description': new FormControl(''),
    'isActive': new FormControl,
  });

  constructor(
    private taxService: TaxService,
    private route: Router,
    private messageService: MessageService,
    private storageService: StorageService,
    private toastService: ToastService
  ) {
    this.model = this.storageService.getData('data');
    this.populateData(this.model);
  }

  ngOnInit() {
    this.setStatus(this.model.isActive);
  }

  public populateData(arg: Tax) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('percentValue')!.setValue(arg.percentValue);
    this.form.get('description')!.setValue(arg.description);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.markAsUntouched();
  }

  editTax(tax: Tax): Promise<any> {
    return this.taxService.update(tax).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as Tax;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.editTax(this.model).then((result: Tax) => {
      this.populateData(result);
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
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

  setStatus(e: any) {
    if (e) {
      this.message = 'Active';
      this.status = true;
    } else {
      this.message = 'Inactive';
      this.status = false;
    }
  }

  goBack() {
    this.route.navigate(['protected/tax']);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastService } from 'src/app/providers/toast.service';
import { TaxService } from '../tax.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import { TaxNew } from 'src/app/models/tax-new.model';

@Component({
  selector: 'app-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrls: ['./create-tax.component.scss']
})

export class CreateTaxComponent implements OnInit {

  model: TaxNew | any;
  companyId: string = '';
  message: string = '';
  status: boolean = false;
  busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'percentValue': new FormControl(null, [Validators.required]),
    'description': new FormControl(''),
    'isActive': new FormControl,
  });

  constructor(
    public route: Router,
    private taxService: TaxService,
    private toastService: ToastService,
    private location: Location,
    private storageService: StorageService,
    private messageService: MessageService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.form.get('companyId')!.setValue(this.companyId);
    this.form.get('isActive')!.setValue(this.model.isActive);
    this.setStatus(this.model.isActive);
  }

  initForm() {
    this.model = new TaxNew(this.companyId);
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

  addTax(tax: TaxNew): Promise<any> {
    return this.taxService.create(tax).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as TaxNew;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addTax(this.model).then(() => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
      this.initForm();
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

  goBack() {
    this.location.back();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastService } from 'src/app/providers/toast.service';
import { FinancialPeriodService } from '../financial-period.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import { FinancialPeriodNew } from 'src/app/models/financial-period-new.model';

@Component({
  selector: 'app-add-financial-period',
  templateUrl: './add-financial-period.component.html',
  styleUrls: ['./add-financial-period.component.scss']
})
export class AddFinancialPeriodComponent implements OnInit {

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'startDate': new FormControl('', [Validators.required]),
    'endDate': new FormControl('', [Validators.required]),
    'description': new FormControl(''),
    'opened': new FormControl,
  });

  model: FinancialPeriodNew | any;
  companyId: string = '';
  message: string = '';
  status: boolean = false;
  public busy: boolean = false;
  saveStatus: boolean = false;

  constructor(
    public router: Router,
    private financialPeriodService: FinancialPeriodService,
    private toastService: ToastService,
    private location: Location,
    private messageService: MessageService,
    private storageService: StorageService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.model.companyId = this.companyId;

    this.form.get('companyId')!.setValue(this.companyId);
    this.form.get('opened')!.setValue(this.model.opened);
    this.setStatus(this.model.opened);
  }

  initForm() {
    this.model = new FinancialPeriodNew(this.companyId);
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

  addFinancialPeriod(financialPeriod: FinancialPeriodNew): Promise<any> {
    return this.financialPeriodService.create(financialPeriod).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as FinancialPeriodNew;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addFinancialPeriod(this.model).then(() => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
      this.initForm();
    }, (reject) => {
      this.toastService.error(reject);
      this.saveStatus = false;
    })
      .catch((error) => {
        this.toastService.error(error);
        this.saveStatus = false
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

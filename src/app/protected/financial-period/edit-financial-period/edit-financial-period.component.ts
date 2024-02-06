import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastService } from 'src/app/providers/toast.service';
import { FinancialPeriodService } from '../financial-period.service';
import { StorageService } from 'src/app/providers/storage.service';
import { HelperService } from 'src/app/providers/helper.service';
import { MessageService } from 'src/app/providers/message.service';

import { FinancialPeriod } from 'src/app/models/financial-period.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-financial-period',
  templateUrl: './edit-financial-period.component.html',
  styleUrls: ['./edit-financial-period.component.scss']
})
export class EditFinancialPeriodComponent implements OnInit {
  model: FinancialPeriod;
  status: boolean = false;
  message: string = '';
  public busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'id': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'startDate': new FormControl('', [Validators.required]),
    'endDate': new FormControl('', [Validators.required]),
    'description': new FormControl(''),
    'opened': new FormControl,
  });

  constructor(
    private financialPeriodService: FinancialPeriodService,
    private toastService: ToastService,
    private storageService: StorageService,
    private helperService: HelperService,
    private route: Router,
    private messageService: MessageService,
  ) {
    this.model = this.storageService.getData('data');

    const startDate = new Date(this.model.startDate);
    const endDate = new Date(this.model.endDate);

    this.model.startDate = this.helperService.getDateString(startDate);
    this.model.endDate = this.helperService.getDateString(endDate);
    this.populateData(this.model);
  }

  ngOnInit() {
    this.setStatus(this.model.opened);
  }

  editFinancialPeriod(financialPeriod: FinancialPeriod): Promise<any> {
    return this.financialPeriodService.update(financialPeriod).toPromise();
  }

  goBack() {
    this.route.navigate(['protected/financial-period']);
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as FinancialPeriod;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.editFinancialPeriod(this.model).then((result: FinancialPeriod) => {
      const startDate = new Date(result.startDate);
      const endDate = new Date(result.endDate);

      result.startDate = this.helperService.getDateString(startDate);
      result.endDate = this.helperService.getDateString(endDate);
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

  public populateData(arg: FinancialPeriod) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('startDate')!.setValue(arg.startDate);
    this.form.get('endDate')!.setValue(arg.endDate);
    this.form.get('description')!.setValue(arg.description);
    this.form.get('opened')!.setValue(arg.opened);
    this.form.markAsUntouched();
  }

}

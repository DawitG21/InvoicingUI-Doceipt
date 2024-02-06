import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CompanyNew } from 'src/app/models/company-new.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { CompanyService } from '../company.service';
import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { CurrencyService } from 'src/app/providers/currency.service';

@Component({
  selector: 'app-add-company',
  styleUrls: ['./add-company.component.scss'],
  templateUrl: './add-company.component.html',
})
export class AddCompanyComponent {

  public busy: boolean = false;
  public model: CompanyNew | any;
  public currencies: string[] = [];
  public form = new FormGroup({
    currency: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    identityName: new FormControl('', [Validators.required]),
  });

  constructor(
    private companyService: CompanyService,
    private toastService: ToastService,
    private messageService: MessageService,
    private broadcastService: BroadcastService,
    private currencyService: CurrencyService,
    private location: Location,
  ) {
    this.initForm();
  }

  public initForm() {
    this.model = new CompanyNew();
    this.currencies = this.currencyService.getCurrencies;
  }

  public return() {
    this.location.back();
  }

  public addCompany(company: CompanyNew): Promise<any> {
    return this.companyService.create(company).toPromise();
  }

  public save() {
    this.busy = true;
    this.model = this.form.value as CompanyNew;
    if (this.model.displayName === '' || this.model.identityName === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addCompany(this.model).then((result) => {
      this.toastService.success(this.messageService.operationSuccesful);
      const message = new BroadcastMessage(this.messageService.companyAddSender, result);
      this.broadcastService.broadcastTask(message);
      this.initForm();
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

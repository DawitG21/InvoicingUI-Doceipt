import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CompanyNew } from 'src/app/models/company-new.model';

import { CreateAccountService } from '../create-account.service';
import { ToastService } from 'src/app/providers/toast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { CurrencyService } from 'src/app/providers/currency.service';
import { MessageService } from 'src/app/providers/message.service';

@Component({
  selector: 'app-index',
  styleUrls: ['./index.component.scss'],
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {

  public model: CompanyNew;
  public currencies: string[] = [];
  public form = new FormGroup({
    currency: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    identityName: new FormControl('', [Validators.required]),
  });
  public busy: boolean = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private createAccountService: CreateAccountService,
    private storageService: StorageService,
    private currencyService: CurrencyService,
    private messageService: MessageService,
  ) {
    this.model = new CompanyNew();
  }

  public ngOnInit() {
    this.currencies = this.currencyService.getCurrencies;
  }

  public signup(model: CompanyNew): Promise<any> {
    return this.createAccountService.signup(model).toPromise();
  }

  public save() {
    this.busy = true;
    this.model = this.form.value as CompanyNew;
    if (this.model.displayName === '' ||
      this.model.identityName === '' ||
      this.model.currency === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.signup(this.model).then((result) => {
      this.storageService.setCompanyId(result.id);
      this.toastService.success(this.messageService.operationSuccesful);
      this.router.navigate(['protected/create-account/setup-customer-group']);
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

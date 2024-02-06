import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

import { ConnectorNew } from 'src/app/models/connector-new.model';
import { PaymentMethod } from 'src/app/models/payment-method.model';
import { Flag } from 'src/app/models/flag.model';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { PaymentMethodService } from '../../payment-method/payment-method.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ConnectorService } from '../connector.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { SearchResult } from 'src/app/interfaces/search-result';

import { ApikeyDialogComponent } from '../../app-dialog/apikey-dialog/apikey-dialog.component';

@Component({
  selector: 'app-add-connector',
  templateUrl: './add-connector.component.html',
  styleUrls: ['./add-connector.component.scss']
})
export class AddConnectorComponent implements OnInit {

  model: ConnectorNew | any;
  companyId: string = '';
  paymentMethods: PaymentMethod[] = [];
  pageSize = 10;
  busy: boolean = false;
  page = 1;
  sortOrder = 'asc';
  pageSizeOptions: number[] = [5, 10, 25];
  flags: Flag[] = [];
  providers: Flag[] = [];
  public claims: any;
  public saveStatus: boolean = false;
  public paymentMethodName = new FormControl({ value: '', disabled: true });
  public paymentMethodExists: boolean = false;
  public selectedPaymentMethod!: PaymentMethod;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'description': new FormControl(''),
    'domains': new FormControl(''),
    // 'paymentMethod': new FormControl({ value: null, disabled: true }),
    'flags': new FormArray([], [Validators.required]),
    'provider': new FormControl(null),
  });

  constructor(
    private location: Location,
    private storageService: StorageService,
    private paymentMethodService: PaymentMethodService,
    private connectorService: ConnectorService,
    private toastService: ToastService,
    private messageService: MessageService,
    public dialog: MatDialog,
    private authService: AuthService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.initalize();

    // search service after every key stroke
    this.paymentMethodName.valueChanges
      .subscribe(value => {
        if (value.length >= 1) {
          this.searchPaymentMethods(value)
            .then((result: SearchResult) => {
              this.paymentMethods = result.data;
              this.paymentMethodValidator();
              this.paymentMethodName.updateValueAndValidity({ emitEvent: false });
            })
        }
        else {
          return null;
        }
      });
  }

  initForm() {
    this.model = new ConnectorNew(this.companyId);
    this.form.reset();
    this.form.get('companyId')!!.setValue(this.companyId);
  }

  goBack() {
    this.location.back();
  }

  initalize() {
    this.busy = true;

    if (this.claims && this.claims.doceipt_claim_paymentmethod_access) {
      this.paymentMethodName!.enable();
      this.searchPaymentMethods(" ").then((result: SearchResult) => {
        this.paymentMethods = result.data;
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

    this.searchFlags('CONNECTOR');
    this.searchFlags('PROVIDER');
  }

  public searchPaymentMethods(value: string): Promise<any> {
    return this.paymentMethodService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public search(searchText: string): Promise<any> {
    return this.connectorService.searchFlag(searchText, this.page, this.pageSize, 'asc').toPromise();
  }

  public searchFlags(searchText: string): void {
    this.busy = true;
    this.search(searchText).then((result: SearchResult) => {
      if (searchText === 'CONNECTOR') {
        this.flags = result.data;
      } else if (searchText === 'PROVIDER') {
        this.providers = result.data;
      }
    }, (reject) => {
      this.toastService.error(this.messageService.serverError);
    })
      .catch((error) => {
        this.toastService.error(this.messageService.serverError);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  deselectProvider() {
    this.form.get('provider')!.setValue(null);
  }

  deselectPaymentMethod() {
    this.form.get('paymentMethod')!.setValue(null);
  }

  public create(model: ConnectorNew): Promise<any> {
    return this.connectorService.create(model).toPromise();
  }

  save() {
    if (!this.claims || !this.claims.doceipt_user_isOwner) {
      this.toastService.error(this.messageService.NO_ENOUGH_PERMISSION);
      return;
    }
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as ConnectorNew;
    this.model.companyId = this.companyId;
    let isPaymentMethodSelected = true;

    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      this.busy = false;
      this.saveStatus = false;
      return;
    }

    if (!this.paymentMethodExists) {
      this.model.flags.forEach((flag: Flag) => {
        if (flag.name === 'CONNECTOR_PAYMENT_SAVE') {
          isPaymentMethodSelected = false;
          this.toastService.warning(this.messageService.paymentMethodMandatory);
          this.busy = false;
          this.saveStatus = false;
          return;
        }
      });
    }

    if (this.paymentMethodExists) {
      this.model.paymentMethod = this.selectedPaymentMethod;
    }

    if (isPaymentMethodSelected) {
      this.create(this.model).then((result) => {
        this.toastService.success(this.messageService.operationSuccesful);
        this.openApiKeyDialog(result.apiKeyHashless);
        this.initForm();
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
  }

  openApiKeyDialog(apiKey: string) {
    return this.dialog.open(ApikeyDialogComponent, {
      width: '800px',
      data: { message: apiKey }
    });
  }

  onCheckChange(event: any) {
    const formArray: FormArray = this.form.get('flags') as FormArray;

    if (event.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.source.value));
    } else {
      let i = 0;
      formArray.controls.forEach((ctrl, index, arrCtrl) => {
        if (ctrl.value === event.source.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  public paymentMethodValidator(): any {
    this.paymentMethodExists = false;
    let paymentMethod = this.paymentMethodName.value;
    for (let i = 0; i < this.paymentMethods.length; i++) {
      if (this.paymentMethods[i].name === paymentMethod) {
        this.paymentMethodExists = true;
        this.selectedPaymentMethod = this.paymentMethods[i];
        this.paymentMethodName.clearValidators();
      }
    }
    if (!this.paymentMethodExists) {
      this.paymentMethodExists = false;
      this.paymentMethodName.setValidators(f => <any>{ notvalid: true });
    }
  }

}

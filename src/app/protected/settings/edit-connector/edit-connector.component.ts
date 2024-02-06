import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Connector } from 'src/app/models/connector.model';
import { PaymentMethod } from 'src/app/models/payment-method.model';
import { Flag } from 'src/app/models/flag.model';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { PaymentMethodService } from '../../payment-method/payment-method.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ConnectorService } from '../connector.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-edit-connector',
  templateUrl: './edit-connector.component.html',
  styleUrls: ['./edit-connector.component.scss']
})
export class EditConnectorComponent implements OnInit {

  model: Connector;
  companyId: string = '';
  PaymentMethods: PaymentMethod[] = [];
  pageSize = 10;
  busy: boolean = false;
  page = 1;
  pageSizeOptions: number[] = [5, 10, 25];
  flags: Flag[] = [];
  providers: Flag[] = [];
  selectedFlags: Flag[] = [];
  public claims: any;
  public paymentMethodDisabled = true;
  public saveStatus: boolean = false;
  public selectedPaymentMethod!: PaymentMethod;
  public paymentMethodExists: boolean = false;
  sortOrder = 'asc';

  flagsForm: FormControl = new FormControl();
  selectedFlagsList: Flag[] = [];

  paymentMethodForm: FormControl = new FormControl({ value: '', disabled: true });
  providerForm: FormControl = new FormControl();

  form = new FormGroup({
    'id': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'description': new FormControl(''),
    'domains': new FormControl(''),
    'flags': new FormArray([]),
    'provider': new FormControl(null),
  });

  constructor(
    private storageService: StorageService,
    private paymentMethodService: PaymentMethodService,
    private connectorService: ConnectorService,
    private toastService: ToastService,
    private messageService: MessageService,
    private authService: AuthService,
    private route: Router,
  ) {
    this.model = this.storageService.getData('data');
    this.populateData(this.model);
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.initalize();

    // search service after every key stroke
    this.paymentMethodForm.valueChanges
      .subscribe(value => {
        if (value.length >= 1) {
          this.searchPaymentMethods(value)
            .then((result: SearchResult) => {
              this.PaymentMethods = result.data;
              this.paymentMethodValidator();
              this.paymentMethodForm.updateValueAndValidity({ emitEvent: false });
            })
        }
        else {
          return null;
        }
      });
  }

  public populateData(arg: Connector) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('description')!.setValue(arg.description);
    if (arg.domains) {
      this.form.get('domains')!.setValue(arg.domains);
    }
    this.selectedFlags = arg.flags;
    const formArray: FormArray = this.form.get('flags') as FormArray;
    formArray.clear();
    this.selectedFlags.forEach((flag) => {
      formArray.push(new FormControl(flag));
    });
    this.form.get('provider')!.setValue(arg.provider);
    if (arg && arg.paymentMethod) {
      this.paymentMethodForm!.setValue(arg.paymentMethod.name);
      this.selectedPaymentMethod = arg.paymentMethod;
      this.paymentMethodExists = true;
    }
    if (arg && arg.provider) {
      this.providerForm!.setValue(arg.provider.id);
    }
    this.form.markAsUntouched();
    this.paymentMethodForm.markAsUntouched();
    this.providerForm.markAsUntouched();
  }

  initalize() {
    this.busy = true;
    if (this.claims && this.claims.doceipt_claim_paymentmethod_access) {
      this.searchPaymentMethods(" ").then((result: SearchResult) => {
        this.PaymentMethods = result.data;
        this.paymentMethodForm.enable();
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

  searchFlags(searchText: string): void {
    this.busy = true;
    this.search(searchText).then((result: SearchResult) => {
      if (searchText === 'CONNECTOR') {
        this.flags = result.data;
        const newArray = [];
        for (let i = 0; i < this.model.flags.length; i++) {
          newArray.push(this.model.flags[i].id);
        }
        this.flagsForm!.setValue(newArray);
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

  goBack() {
    this.route.navigate(['/protected/settings']);
  }

  public update(model: Connector): Promise<any> {
    return this.connectorService.update(model).toPromise();
  }

  deselectPaymentMethod() {
    this.model.paymentMethod = new PaymentMethod();
    this.paymentMethodForm!.setValue(null);
    this.form.get('paymentMethod')!.setValue(null);
  }

  deselectProvider() {
    this.model.provider = new Flag();
    this.providerForm!.setValue(null);
    this.form.get('provider')!.setValue(null);
  }

  save() {
    if (!this.claims || !this.claims.doceipt_user_isOwner) {
      this.toastService.error(this.messageService.NO_ENOUGH_PERMISSION);
      return;
    }
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as Connector;
    let isPaymentMethodSelected = true;

    if (this.providerForm.value !== null) {
      this.providers.forEach(element => {
        if (element.id === this.providerForm.value) {
          this.model.provider = element;
        }
      });
    }

    if (this.paymentMethodExists) {
      this.model.paymentMethod = this.selectedPaymentMethod;
    }

    if (!this.paymentMethodExists) {
      this.model.flags.forEach((flag) => {
        if (flag.name === 'CONNECTOR_PAYMENT_SAVE') {
          isPaymentMethodSelected = false;
          this.toastService.warning(this.messageService.paymentMethodMandatory);
          this.busy = false;
          this.saveStatus = false;
          return;
        }
      });
    }

    if (this.model && this.model.name.trim() === '' ||
      this.model.flags.length === 0) {
      this.toastService.warning(this.messageService.mandatoryFields);
      this.busy = false;
      return;
    }

    if (isPaymentMethodSelected === true) {
      this.update(this.model).then((result: Connector) => {
        this.populateData(result);
        this.toastService.success(this.messageService.operationSuccesful);
      }, (reject) => {
        this.toastService.error(reject);
      })
        .catch((error) => {
          this.toastService.error(error);
        })
        .finally(() => {
          this.busy = false;
          this.saveStatus = false;
        });
    }

  }

  onCheckChange(event: any) {
    const formArray: FormArray = this.form.get('flags') as FormArray;

    if (event.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.source.value));
    } else {
      let i = 0;
      formArray.controls.forEach((ctrl, index, arrCtrl) => {
        if (ctrl.value.id === event.source.value.id) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  getCheckedValue(item: Flag): boolean {
    if (!this.selectedFlags || this.selectedFlags.length === 0) {
      return false;
    }
    return this.selectedFlags.findIndex((x) => x.id === item.id) > -1;
  }

  get flagsChanged() {
    return (JSON.stringify(this.selectedFlags) !== JSON.stringify(this.form.get('flags')!.value));
  }

  public paymentMethodValidator(): any {
    this.paymentMethodExists = false;
    let paymentMethod = this.paymentMethodForm.value;
    for (let i = 0; i < this.PaymentMethods.length; i++) {
      if (this.PaymentMethods[i].name === paymentMethod) {
        this.paymentMethodExists = true;
        this.selectedPaymentMethod = this.PaymentMethods[i];
        this.paymentMethodForm.clearValidators();
      }
    }
    if (!this.paymentMethodExists) {
      this.paymentMethodExists = false;
      this.paymentMethodForm.setValidators(f => <any>{ notvalid: true });
    }
  }

}

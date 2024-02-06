import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { CustomerGroup } from 'src/app/models/customer-group.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';
import { Service } from 'src/app/models/service.model';
import { Tax } from 'src/app/models/tax.model';
import { ServiceFeeNew } from 'src/app/models/service-fee-new.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { CompanyService } from '../../company/company.service';
import { CustomerGroupService } from '../../customer-group/customer-group.service';
import { PaymentCycleService } from '../../payment-cycle/payment-cycle.service';
import { ServiceFeeService } from '../service-fee.service';
import { ServiceService } from '../../service/service.service';
import { TaxService } from '../../tax/tax.service';
import { ToastService } from 'src/app/providers/toast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { HelperService } from 'src/app/providers/helper.service';
import { MessageService } from 'src/app/providers/message.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { CurrencyService } from 'src/app/providers/currency.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { CustomerGroupSearchComponent } from '../../customer-group/customer-group-search/customer-group-search.component';
import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-create-service-fee',
  styleUrls: ['./create-service-fee.component.scss'],
  templateUrl: './create-service-fee.component.html',
})

export class CreateServiceFeeComponent implements OnInit {

  public currencies: string[] = [];
  public companyCurrency: string = '';
  public model: ServiceFeeNew | any;
  public message: string = '';
  public status: boolean = false;
  public companyId: string = '';
  public paymentCycles: PaymentCycle[] = [];
  public customerGroupList: CustomerGroup[] = [];
  public servicesList: Service[] = [];
  public taxesList: Tax[] = [];
  public customerGroup: CustomerGroup | any;
  public busy: boolean = false;
  public selectedTaxes: Tax[] = [];
  public claims: any;
  public saveStatus: boolean = false;
  public isAutoGenerate: boolean = false;
  public page = 1;
  public pageSize = 10;
  public searchText = '';
  public sortOrder = 'asc';
  public serviceName = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public serviceExists: boolean = false;
  public selectedService!: Service;
  public customerGroupName = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public customerGroupExists: boolean = false;
  public selectedCustomerGroup!: CustomerGroup;
  public paymentCycleName = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public paymentCycleExists: boolean = false;
  public selectedPaymentCycle!: PaymentCycle;

  public form = new FormGroup({
    amount: new FormControl('', [Validators.required]),
    companyId: new FormControl('', [Validators.required]),
    currency: new FormControl({ value: '', disabled: true }, [Validators.required]),
    customerGroupId: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    name: new FormControl({ value: '', disabled: false }, [Validators.required]),
    paymentCycleId: new FormControl({ value: '', disabled: true }, [Validators.required]),
    serviceId: new FormControl({ value: '', disabled: true }, [Validators.required]),
    taxInclusive: new FormControl(),
    taxes: new FormControl(),
  });

  public dataSource = new MatTableDataSource<Tax>();
  public displayedColumns: string[] = [
    'checked',
    'name',
    'percentValue',
    'description',
  ];

  constructor(
    public dialog: MatDialog,
    public storageService: StorageService,
    public paymentCycleService: PaymentCycleService,
    public customerGroupService: CustomerGroupService,
    public serviceService: ServiceService,
    public serviceFeeService: ServiceFeeService,
    public taxService: TaxService,
    public toastService: ToastService,
    public helper: HelperService,
    private location: Location,
    private messageService: MessageService,
    private companyService: CompanyService,
    private currencyService: CurrencyService,
    private authService: AuthService,
  ) {
    this.initForm();
  }

  public ngOnInit() {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.form.get('companyId')!.setValue(this.companyId);
    this.form.get('taxInclusive')!.setValue(this.model.taxInclusive);
    this.form.get('taxes')!.setValue(this.model.taxes);
    this.customerGroup = new CustomerGroup();

    // search service after every key stroke
    this.serviceName.valueChanges
      .subscribe(value => {
        if (value.length >= 1) {
          this.searchService(value)
            .then((result: SearchResult) => {
              this.servicesList = result.data;
              this.serviceValidator();
              this.serviceName.updateValueAndValidity({ emitEvent: false });
            })
        }
        else {
          return null;
        }
      });

    // search customer group after every key stroke
    this.customerGroupName.valueChanges
      .subscribe(value => {
        if (value.length >= 1) {
          this.searchCustomerGroup(value)
            .then((result: SearchResult) => {
              this.customerGroupList = result.data;
              this.customerGroupValidator();
              this.customerGroupName.updateValueAndValidity({ emitEvent: false });
            })
        }
        else {
          return null;
        }
      });

    // search payment cycle after every key stroke
    this.paymentCycleName.valueChanges
      .subscribe(value => {
        if (value.length >= 1) {
          this.searchPaymentCycle(value)
            .then((result: SearchResult) => {
              this.paymentCycles = result.data;
              this.paymentCycleValidator();
              this.paymentCycleName.updateValueAndValidity({ emitEvent: false });
            })
        }
        else {
          return null;
        }
      });

    // get company
    this.getCompany(this.companyId).then((result) => {
      this.form.get('currency')!.setValue(result.currency);
      this.companyCurrency = result.currency;
    }, (reject) => {
      this.toastService.error(reject);
    })
      .catch((error) => {
        this.toastService.error(error);
      })
      .finally(() => {
        this.busy = false;
      });

    // get all payment cycles
    if (this.claims && this.claims.doceipt_claim_paymentcycle_access) {
      // this.form.get('paymentCycleId')!.enable();
      this.paymentCycleName.enable();
      this.getAllPaymentCycle().then((result: any) => {
        this.paymentCycles = result;
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

    // get all services
    if (this.claims && this.claims.doceipt_claim_service_access) {
      this.form.get('serviceId')!.enable();
      this.serviceName.enable();
      this.searchService('').then((result: SearchResult) => {
        this.servicesList = result.data;
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

    // get all customer groups
    if (this.claims && this.claims.doceipt_claim_customergroup_access) {
      this.customerGroupName.enable();
      this.searchCustomerGroup('').then((result: SearchResult) => {
        this.customerGroupList = result.data;
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

    // get all taxes
    if (this.claims && this.claims.doceipt_claim_tax_access) {
      this.getTaxes(this.companyId).then((result: SearchResult) => {
        this.taxesList = result.data;
        this.dataSource = new MatTableDataSource<Tax>(this.taxesList);
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

  public initForm() {
    this.model = new ServiceFeeNew();
    this.currencies = this.currencyService.getCurrencies;
    this.setStatus(this.model.taxInclusive);
    this.selectedTaxes = [];
  }

  public setAutoGenerate(e: any) {
    if (e) {
      this.isAutoGenerate = true;
      this.form.get("name")?.setValue('');
      this.form.get("name")?.disable();
      this.paymentCycleName.setValue('');
      this.paymentCycleName.disable();
    } else {
      this.isAutoGenerate = false;
      this.form.get("name")?.setValue('');
      this.form.get("name")?.enable();
      this.paymentCycleName.setValue('');
      this.paymentCycleName.enable();
    }
  }

  public searchService(value: string): Promise<any> {
    return this.serviceService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public searchCustomerGroup(value: string): Promise<any> {
    return this.customerGroupService.searchCustomerGroup(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public getCompany(id: string): Promise<any> {
    return this.companyService.get(id).toPromise();
  }

  public async getAllPaymentCycle(): Promise<any> {
    return await this.paymentCycleService.getAll(this.companyId, this.page, this.pageSize);
  }

  public searchPaymentCycle(value: string): Promise<any> {
    return this.paymentCycleService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public getTaxes(companyId: string): Promise<any> {
    return this.taxService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public setStatus(e: any) {
    if (e) {
      this.message = 'Tax Inclusive';
      this.status = true;
    } else {
      this.message = 'Tax Exclusive';
      this.status = false;
    }
  }

  public addServiceFee(serviceFee: ServiceFeeNew): Promise<any> {
    return this.serviceFeeService.create(serviceFee).toPromise();
  }

  public prepareSave() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as ServiceFeeNew;
    this.model.taxes = this.selectedTaxes;
    this.model.currency = this.companyCurrency;
    this.model.serviceId = this.selectedService.id;
    this.model.customerGroupId = this.selectedCustomerGroup.id;
    if (this.isAutoGenerate) {
      for (let i = 0; i < this.paymentCycles.length; i++) {
        this.model.paymentCycleId = this.paymentCycles[i].id;
        this.model.name = this.selectedCustomerGroup.name + " - " + this.paymentCycles[i].name + " - " + this.selectedService.name;
        this.model.paymentCycleId = this.paymentCycles[i].id;
        if (!this.serviceExists || !this.customerGroupExists) {
          this.toastService.warning(this.messageService.mandatoryFields);
          this.busy = false;
          this.saveStatus = false;
          return;
        }

        if (this.model && this.model.name.trim() === '') {
          this.toastService.warning(this.messageService.mandatoryFields);
          return;
        }
        this.save(this.model);
      }

    } else {
      this.model.paymentCycleId = this.selectedPaymentCycle.id;
      if (!this.serviceExists || !this.customerGroupExists || !this.paymentCycleExists) {
        this.toastService.warning(this.messageService.mandatoryFields);
        this.busy = false;
        this.saveStatus = false;
        return;
      }

      if (this.model && this.model.name.trim() === '') {
        this.toastService.warning(this.messageService.mandatoryFields);
        return;
      }

      this.save(this.model);
    }
  }

  public save(model: any) {
    this.addServiceFee(model).then(() => {
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

  get getPaymentCycle() {
    return this.form.get('paymentCycleId');
  }

  get getCustomerGroups() {
    return this.form.get('customerGroupId');
  }

  get getService() {
    return this.form.get('serviceId');
  }

  public getRequiredErrorMessage(field: string) {
    return this.form.get(field)!.hasError('required') ? 'You must enter a value' : '';
  }

  public serviceValidator(): any {
    this.serviceExists = false;
    let service = this.serviceName.value;
    for (let i = 0; i < this.servicesList.length; i++) {
      if (this.servicesList[i].name === service) {
        this.serviceExists = true;
        this.selectedService = this.servicesList[i];
        this.serviceName.clearValidators();
      }
    }
    if (!this.serviceExists) {
      this.serviceExists = false;
      this.serviceName.setValidators(f => <any>{ notvalid: true });
    }
  }

  public customerGroupValidator(): any {
    this.customerGroupExists = false;
    let customerGroup = this.customerGroupName.value;
    for (let i = 0; i < this.customerGroupList.length; i++) {
      if (this.customerGroupList[i].name === customerGroup) {
        this.customerGroupExists = true;
        this.selectedCustomerGroup = this.customerGroupList[i];
        this.customerGroupName.clearValidators();
      }
    }
    if (!this.customerGroupExists) {
      this.customerGroupExists = false;
      this.customerGroupName.setValidators(f => <any>{ notvalid: true });
    }
  }

  public paymentCycleValidator(): any {
    this.paymentCycleExists = false;
    let pc = this.paymentCycleName.value;
    for (let i = 0; i < this.paymentCycles.length; i++) {
      if (this.paymentCycles[i].name === pc) {
        this.paymentCycleExists = true;
        this.selectedPaymentCycle = this.paymentCycles[i];
        this.paymentCycleName.clearValidators();
      }
    }
    if (!this.paymentCycleExists) {
      this.paymentCycleExists = false;
      this.paymentCycleName.setValidators(f => <any>{ notvalid: true });
    }
  }

  public return() {
    this.location.back();
  }

  public onCheckChange(event: any, element: any) {
    if (event.checked) {
      this.selectedTaxes.push(element);
    } else {
      for (const tax of this.selectedTaxes) {
        if (tax.id === element.id) {
          const index = this.selectedTaxes.indexOf(tax);
          this.selectedTaxes.splice(index, 1);
        }
      }
    }
  }

}

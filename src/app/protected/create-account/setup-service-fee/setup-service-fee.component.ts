import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ServiceFeeNew } from 'src/app/models/service-fee-new.model';
import { ServiceFeeService } from '../../service-fee/service-fee.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { CustomerGroupService } from '../../customer-group/customer-group.service';
import { PaymentCycleService } from '../../payment-cycle/payment-cycle.service';
import { ServiceService } from '../../service/service.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { CurrencyService } from 'src/app/providers/currency.service';
import { CompanyService } from '../../company/company.service';

import { CustomerGroup } from 'src/app/models/customer-group.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';
import { Service } from 'src/app/models/service.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Currency } from 'src/app/models/currency.model';

import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-setup-service-fee',
  styleUrls: ['./setup-service-fee.component.scss'],
  templateUrl: './setup-service-fee.component.html',
})
export class SetupServiceFeeComponent implements OnInit {

  public form = new FormGroup({
    amount: new FormControl([Validators.required]),
    currency: new FormControl([Validators.required]),
    customerGroupId: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    paymentCycleId: new FormControl('', [Validators.required]),
    serviceId: new FormControl('', [Validators.required]),
  });
  public model: ServiceFeeNew | any;
  public currencies: string[] = [];
  public companyId: string = '';
  private customerGroups: CustomerGroup[] = [];
  private paymentsCycles: PaymentCycle[] = [];
  private services: Service[] = [];
  private page = 1;
  private searchText = '';
  private pageSize = 10;
  public sortOrder = 'asc';
  public busy: boolean = false;

  constructor(
    public route: Router,
    public serviceFeeService: ServiceFeeService,
    public customerGroupService: CustomerGroupService,
    private paymentCycleService: PaymentCycleService,
    private serviceService: ServiceService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private currencyService: CurrencyService,
    private companyService: CompanyService,
  ) {
  }

  public ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.model = new ServiceFeeNew();
    this.currencies = this.currencyService.getCurrencies;

    this.getCompany();
    this.loadCustomerGroup();
    this.loadPaymentCycles();
    this.loadServices();
  }

  private get(companyId: string): Promise<any> {
    return this.companyService.get(companyId).toPromise();
  }

  private getCompany() {
    this.busy = true;
    this.get(this.companyId).then((result) => {
      this.form.get('currency')!.setValue(result.currency);
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

  private getAllPaymentCycles(companyId: string): Promise<any> {
    return this.paymentCycleService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder).toPromise();
  }

  private loadPaymentCycles() {
    this.busy = true;
    this.getAllPaymentCycles(this.companyId).then((result: SearchResult) => {
      this.paymentsCycles = result.data;
      this.form.get('paymentCycleId')!.setValue(this.paymentsCycles[0].id);
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

  private getAllServices(companyId: string): Promise<any> {
    return this.serviceService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder).toPromise();
  }

  private loadServices() {
    this.busy = true;
    this.getAllServices(this.companyId).then((result: SearchResult) => {
      this.services = result.data;
      this.form.get('serviceId')!.setValue(this.services[0].id);
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

  private search(companyId: string): Promise<any> {
    return this.customerGroupService.search(companyId, this.searchText, this.page, this.pageSize, 'asc', false).toPromise();
  }

  private loadCustomerGroup() {
    this.busy = true;
    this.search(this.companyId).then((result: SearchResult) => {
      this.customerGroups = result.data;
      this.form.get('customerGroupId')!.setValue(this.customerGroups[0].id);
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

  private addServiceFee(serviceFee: ServiceFeeNew): Promise<any> {
    return this.serviceFeeService.create(serviceFee).toPromise();
  }

  public save() {
    this.model = this.form.value as ServiceFeeNew;
    if (this.model.name === '' ||
      !this.model.currency ||
      !this.model.amount) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addServiceFee(this.model).then(() => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.skipToDashboard();
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

  public skipToDashboard() {
    const message = new BroadcastMessage('show-navs');
    this.broadcastService.broadcastTask(message);
    this.route.navigate(['/protected/dashboard']);
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CustomerGroup } from 'src/app/models/customer-group.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';
import { Service } from 'src/app/models/service.model';
import { ServiceFeeUpdate } from 'src/app/models/service-fee-update.model';
import { ServiceFee } from 'src/app/models/service-fee.model';
import { Tax } from 'src/app/models/tax.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { ToastService } from 'src/app/providers/toast.service';
import { ServiceFeeService } from '../service-fee.service';
import { ServiceService } from '../../service/service.service';
import { CustomerGroupService } from '../../customer-group/customer-group.service';
import { PaymentCycleService } from '../../payment-cycle/payment-cycle.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { TaxService } from '../../tax/tax.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { CurrencyService } from 'src/app/providers/currency.service';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { AddTaxDialogComponent } from '../add-tax-dialog/add-tax-dialog.component';
import { Router } from '@angular/router';
import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-update-service-fee',
  styleUrls: ['./update-service-fee.component.scss'],
  templateUrl: './update-service-fee.component.html',
})
export class UpdateServiceFeeComponent implements OnInit {

  public currencies: string[] = [];
  public displayedColumns: string[] = [
    'name',
    'percentValue',
    'description',
    'actions',
  ];

  public busy: boolean = false;
  public saveStatus: boolean = false;
  public pageSize = 10;
  public page = 1;
  public sortOrder = 'asc';
  public searchText = ' ';

  public dataSource = new MatTableDataSource<Tax>();
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator | any;

  public arg: ServiceFee;
  public model!: ServiceFeeUpdate;
  public taxUpdate: any;
  public status: boolean = false;
  public message: string = '';
  public paymentCycles: PaymentCycle[] = [];
  public servicesList: Service[] = [];
  public taxesList: Tax[] = [];
  public filteredTaxes: any;
  public companyId: string;
  public subscription: Subscription;
  public index: number | any;
  public cheakedId: string = '';
  public showAddTaxBtn: boolean = false;
  public claims: any;
  public selectedService!: Service;
  public selectedCustomerGroup!: CustomerGroup;
  public serviceExists: boolean = false;
  public customerGroupExists: boolean = false;
  public customerGroupList: CustomerGroup[] = [];
  public paymentCycleName = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public paymentCycleExists: boolean = false;
  public selectedPaymentCycle!: PaymentCycle;

  public form = new FormGroup({
    amount: new FormControl('', [Validators.required]),
    companyId: new FormControl('', [Validators.required]),
    currency: new FormControl({ value: '', disabled: true }, [Validators.required]),
    description: new FormControl(''),
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    paymentCycleId: new FormControl('', [Validators.required]),
    taxInclusive: new FormControl(),
    taxes: new FormControl(),
  });

  public paymentCycleForm: FormControl = new FormControl();
  public serviceForm: FormControl = new FormControl({ value: null, disabled: true }, [Validators.required]);
  public customerGroupName = new FormControl({ value: '', disabled: true }, [Validators.required]);

  constructor(
    public dialog: MatDialog,
    public paymentCycleService: PaymentCycleService,
    public customerGroupService: CustomerGroupService,
    public serviceService: ServiceService,
    public serviceFeeService: ServiceFeeService,
    public taxService: TaxService,
    private storageService: StorageService,
    private messageService: MessageService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private currencyService: CurrencyService,
    private authService: AuthService,
    private route: Router,
  ) {
    this.companyId = this.storageService.getCompanyId;
    this.arg = this.storageService.getData('data');
    this.populateData(this.arg);

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.serviceFeeTaxAdded) {
          this.arg.taxes = message.data;
          this.form.get('taxes')!.setValue(this.arg.taxes);
          this.dataSource = new MatTableDataSource<Tax>(this.arg.taxes);
          this.getAllTaxes();
        }
      });
  }

  public ngOnInit() {
    this.initializer();
    this.setStatus(this.arg.taxInclusive);
    this.dataSource.paginator = this.paginator;

    // search service after every key stroke
    this.serviceForm.valueChanges
      .subscribe(value => {
        if (value.length >= 1) {
          this.searchService(value)
            .then((result: SearchResult) => {
              this.servicesList = result.data;
              this.serviceValidator();
              this.serviceForm.updateValueAndValidity({ emitEvent: false });
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
  }

  public populateData(obj: ServiceFee) {
    this.dataSource = new MatTableDataSource<Tax>(obj.taxes);
    this.form.get('id')!.setValue(obj.id);
    this.form.get('name')!.setValue(obj.name);
    this.form.get('description')!.setValue(obj.description);
    this.form.get('amount')!.setValue(obj.amount);
    this.form.get('currency')!.setValue(obj.currency);
    this.form.get('taxInclusive')!.setValue(obj.taxInclusive);
    this.form.get('taxes')!.setValue(obj.taxes);
    this.form.get('paymentCycleId')!.setValue(obj.paymentCycle.id);
    this.form.get('companyId')!.setValue(this.companyId);
    this.paymentCycleForm!.setValue(obj.paymentCycle.id);
    this.serviceForm!.setValue(obj.service.name);
    this.selectedService = obj.service;
    this.selectedPaymentCycle = obj.paymentCycle;
    this.selectedCustomerGroup = obj.customerGroup;
    this.customerGroupName!.setValue(obj.customerGroup.name);
    this.paymentCycleName!.setValue(obj.paymentCycle.name);
    this.serviceExists = true;
    this.customerGroupExists = true;
    this.paymentCycleExists = true;
    this.form.markAsUntouched();
    this.serviceForm.markAsUntouched();
    this.customerGroupName.markAsUntouched();
  }

  public rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
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

  public clearArray() {
    return this.arg.taxes = [];
  }

  public initializer() {
    this.claims = this.authService.userClaims;
    this.currencies = this.currencyService.getCurrencies;

    if ((this.claims && this.claims.doceipt_claim_tax_access) &&
      (this.claims && this.claims.doceipt_claim_servicefee_tax_create)) {
      this.showAddTaxBtn = true;
    }

    // get all payment cycles
    if (this.claims && this.claims.doceipt_claim_paymentcycle_access) {
      this.paymentCycleName.enable();
      this.searchPaymentCycle(" ").then((result: SearchResult) => {
        this.paymentCycles = result.data;
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
      this.serviceForm.enable();
      this.searchService('')
        .then((result: SearchResult) => {
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
      this.getAllTaxes();
    }
  }

  public getAllTaxes() {
    this.getTaxes(this.companyId).then((result: SearchResult) => {
      this.taxesList = result.data;
      this.arg.taxes.forEach((item2) => {
        this.taxesList = this.taxesList.filter((item1) => {
          return JSON.stringify(item1) !== JSON.stringify(item2);
        });
      });
      this.filteredTaxes = this.taxesList;
      if (this.filteredTaxes.length === 0) {
        this.showAddTaxBtn = false;
      } else {
        this.showAddTaxBtn = true;
      }
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

  public searchPaymentCycle(value: string): Promise<any> {
    return this.paymentCycleService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public searchCustomerGroup(value: string): Promise<any> {
    return this.customerGroupService.searchCustomerGroup(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public searchService(value: string): Promise<any> {
    return this.serviceService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public getTaxes(companyId: string): Promise<any> {
    return this.taxService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder).toPromise();
  }

  public getRequiredErrorMessage(field: string) {
    return this.form.get(field)!.hasError('required') ? 'You must enter a value' : '';
  }

  public editServiceFee(servcieFee: ServiceFeeUpdate): Promise<any> {
    return this.serviceFeeService.update(servcieFee).toPromise();
  }

  public save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as ServiceFeeUpdate;
    this.model.currency = this.arg.currency;

    if (!this.serviceExists || !this.customerGroupExists || !this.paymentCycleExists) {
      this.toastService.warning(this.messageService.mandatoryFields);
      this.busy = false;
      this.saveStatus = false;
      return;
    }

    this.model.customerGroupId = this.selectedCustomerGroup.id;
    this.model.serviceId = this.selectedService.id;
    this.model.paymentCycleId = this.selectedPaymentCycle.id;

    if (this.model && this.model.name.trim() === '' ||
      this.model.amount === null || this.model.amount <= 0) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.editServiceFee(this.model).then((result: ServiceFee) => {
      this.arg = result;
      this.populateData(result);
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = true;
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

  public return() {
    this.route.navigate(['protected/service-fee']);
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

  public serviceValidator(): any {
    this.serviceExists = false;
    let service = this.serviceForm.value;
    for (let i = 0; i < this.servicesList.length; i++) {
      if (this.servicesList[i].name === service) {
        this.serviceExists = true;
        this.selectedService = this.servicesList[i];
        this.serviceForm.clearValidators();
      }
    }
    if (!this.serviceExists) {
      this.serviceExists = false;
      this.serviceForm.setValidators(f => <any>{ notvalid: true });
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

  public checkedTax(tax: any) {
    this.taxUpdate = tax;
  }

  public deleteServiceFeeTax(id: string, cheakedId: string): Promise<any> {
    return this.serviceFeeService.deleteTax(id, cheakedId).toPromise();
  }

  public getDeleteDialog(serviceFee: ServiceFee, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: serviceFee.id,
        message: `Are you sure you want to ${action} the Service Fee Tax <br>
        <b>${serviceFee.name}</b>?`,
      },
      width: '450px',
    });
  }

  public openDeleteDialog(servcieFee: ServiceFee) {
    const dialogRef = this.getDeleteDialog(servcieFee, 'delete');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.deleteServiceFeeTax(this.arg.id, servcieFee.id)
          .then(() => {
            const filtered = data.filter(e => e.id !== result);
            this.dataSource.data = filtered;
            this.toastService.success(this.messageService.operationSuccesful);
            for (const tax of this.arg.taxes) {
              if (tax.id === result) {
                const index = this.arg.taxes.indexOf(tax);
                this.arg.taxes.splice(index, 1);
              }
            }
            this.getAllTaxes();
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
    });
  }

  public addTaxDialog(taxes: Tax[], message: string) {
    const data = {
      id: this.arg.id,
      tax: taxes,
    };
    return this.dialog.open(AddTaxDialogComponent, {
      data: { input: data, message: message, },
      width: '600px',
    });
  }

  public openAddTaxDialog() {
    const dialogRef = this.addTaxDialog(this.filteredTaxes, this.messageService.serviceFeeAddTax);

    dialogRef.backdropClick().subscribe(() => {
    });
  }

  get serivceChanged() {
    return (this.selectedService.id !== this.arg.service.id);
  }

  get paymentCycleChanged() {
    return (this.paymentCycleForm.value !== this.arg.paymentCycle.id);
  }

  get customerGroupChanged() {
    return (this.selectedCustomerGroup.id !== this.arg.customerGroup.id);
  }
}

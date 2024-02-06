import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

import { PaymentPolicy } from 'src/app/models/payment-policy.model';
import { Customer } from 'src/app/models/customer.model';
import { FinancialPeriod } from 'src/app/models/financial-period.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';
import { CustomerGroup } from 'src/app/models/customer-group.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { ToastService } from 'src/app/providers/toast.service';
import { PaymentPolicyService } from '../payment-policy.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { FinancialPeriodService } from 'src/app/protected/financial-period/financial-period.service';
import { PaymentCycleService } from 'src/app/protected/payment-cycle/payment-cycle.service';
import { CustomerGroupService } from 'src/app/protected/customer-group/customer-group.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';

import { CustomerSearchComponent } from '../../customer/customer-search/customer-search.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-payment-policy',
  styleUrls: ['./edit-payment-policy.component.scss'],
  templateUrl: './edit-payment-policy.component.html',
})
export class EditPaymentPolicyComponent implements OnInit {

  public model: PaymentPolicy;
  public message: string = '';
  public status: boolean = false;
  public autoDiscount: boolean = false;
  public saveStatus: boolean = false;
  public autoDiscLabel: string = '';
  public customers: Customer[] = [];
  public customersUnchanged: Customer[] = [];
  public removable = true;
  public companyId: string = '';
  public busy: boolean = false;
  public financialPeriodsList: FinancialPeriod[] = [];
  public paymentCyclesList: PaymentCycle[] = [];
  public customerGroupsList: CustomerGroup[] = [];
  public subscription: Subscription;
  public customer: Customer | any;
  public searchText = '';
  public pageSize = 10;
  public page = 1;
  public pageSizeOptions: number[] = [5, 10, 25];
  public claims: any;
  public btnAssignCustomerDisabled = true;

  public form = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    minPercent: new FormControl(null, [Validators.required]),
    description: new FormControl(''),
    isActive: new FormControl(),
    autoDiscount: new FormControl(),
    financialPeriods: new FormControl(null),
    paymentCycles: new FormControl(null),
    customerGroups: new FormControl(null),
    customers: new FormControl(null),
  });

  public displayedColumns: string[] = [
    'pos',
    'name',
    'referenceId',
    'customerGroup',
    'status',
    'actions',
  ];

  public dataSource = new MatTableDataSource<Customer>();
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator | any;

  public fpForm: FormControl = new FormControl({ value: null, disabled: true });
  public selectedFPList: FinancialPeriod[] = [];

  public pcForm: FormControl = new FormControl({ value: null, disabled: true });
  public selectedPCList: PaymentCycle[] = [];

  public pgForm: FormControl = new FormControl({ value: null, disabled: true });
  public selectedPGList: CustomerGroup[] = [];

  constructor(
    public dialog: MatDialog,
    private toastService: ToastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private broadcastService: BroadcastService,
    private paymentPolicyService: PaymentPolicyService,
    private financialPeriodService: FinancialPeriodService,
    private paymentCycleService: PaymentCycleService,
    private customerGroupService: CustomerGroupService,
    private authService: AuthService,
    private route: Router,
  ) {
    this.model = this.storageService.getData('data');
    // this.populateData(this.model);

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.customerSearchSender) {
          this.customer = message.data;
          if (this.customers.length === 0) {
            this.customers.push(this.customer);
          } else {
            let matched = 0;
            for (let i = 0; i < this.customers.length; i++) {
              if (this.customers[i].id === this.customer.id) {
                matched = 1;
                break;
              }
            }
            if (matched === 0) {
              this.customers.push(this.customer);
            }
          }
          this.dataSource = new MatTableDataSource<Customer>(this.customers);
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  public populateData(arg: PaymentPolicy) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('minPercent')!.setValue(arg.minPercent);
    this.form.get('description')!.setValue(arg.description);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.get('autoDiscount')!.setValue(arg.autoDiscount);
    this.form.get('financialPeriods')!.setValue(arg.financialPeriods);
    this.form.get('paymentCycles')!.setValue(arg.paymentCycles);
    this.form.get('customerGroups')!.setValue(arg.customerGroups);
    this.form.get('customers')!.setValue(arg.customers);
    this.customers = arg.customers;
    this.dataSource = new MatTableDataSource<Customer>(this.customers);
    this.dataSource.paginator = this.paginator;
    this.customersUnchanged = _.cloneDeep(arg.customers);
    this.form.markAsUntouched();
  }

  public initialize(reload?: boolean) {
    this.customerGroupsList = [];
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.populateData(this.model);

    if (this.claims && this.claims.doceipt_claim_customer_access) {
      this.btnAssignCustomerDisabled = false;
    }

    if (this.claims && this.claims.doceipt_claim_financialperiod_access) {
      this.getAllFinancialPeriods(this.companyId).then((result) => {
        this.financialPeriodsList = result;
        const newArray = [];
        for (let i = 0; i < this.model.financialPeriods.length; i++) {
          newArray.push(this.model.financialPeriods[i].id);
        }
        this.fpForm!.setValue(newArray);
        this.fpForm.enable();
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

    if (this.claims && this.claims.doceipt_claim_paymentcycle_access) {
      this.getAllPaymentCycle(this.companyId).then((result) => {
        this.paymentCyclesList = result;
        const newArray = [];
        for (let i = 0; i < this.model.paymentCycles.length; i++) {
          newArray.push(this.model.paymentCycles[i].id);
        }
        this.pcForm!.setValue(newArray);
        this.pcForm.enable();
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

    if (this.claims && this.claims.doceipt_claim_customergroup_access) {
      this.searchCustomerGroup();
      this.busy = false;
    } else {
      this.busy = false;
    }
  }

  public rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public getAllFinancialPeriods(companyId: string): Promise<any> {
    return this.financialPeriodService.getAll(companyId, this.page, this.pageSize);
  }

  public getAllPaymentCycle(companyId: string): Promise<any> {
    return this.paymentCycleService.getAll(companyId, this.page, this.pageSize);
  }

  private async searchCustomerGroup() {

    await this.customerGroupService.getAll(this.companyId, 1, this.pageSize).then((result) => {
      this.customerGroupsList = result;
    });

    const newArray = [];
    if (this.model.customerGroups) {
      for (let i = 0; i < this.model.customerGroups.length; i++) {
        newArray.push(this.model.customerGroups[i].id);
      }
    }

    this.pgForm!.setValue(newArray);
    this.pgForm.enable();
  }

  public ngOnInit() {
    this.initialize();
    this.setStatus(this.model.isActive);
    this.setAutoDiscount(this.model.autoDiscount);
    // this.customers = this.model.customers;
  }

  public editPaymentPolicy(paymentPolicy: PaymentPolicy): Promise<any> {
    return this.paymentPolicyService.update(paymentPolicy).toPromise();
  }

  public save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as PaymentPolicy;
    if (this.claims && this.claims.doceipt_claim_financialperiod_access) {
      this.model.financialPeriods = this.selectedFPList;
    }
    if (this.claims && this.claims.doceipt_claim_paymentcycle_access) {
      this.model.paymentCycles = this.selectedPCList;
    }
    if (this.claims && this.claims.doceipt_claim_customergroup_access) {
      this.model.customerGroups = this.selectedPGList;
    }
    this.model.customers = this.customers;
    if (!this.model || this.model.name.trim() === '' ||
      this.model.minPercent < 0 || this.model.minPercent > 100 || this.model.minPercent === null
    ) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }
    this.editPaymentPolicy(this.model).then((result: PaymentPolicy) => {
      this.populateData(result);
      this.initialize();
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

  public setStatus(e: any) {
    if (e) {
      this.message = 'Active';
      this.status = true;
    } else {
      this.message = 'Inactive';
      this.status = false;
    }
  }

  public setAutoDiscount(e: any) {
    if (e) {
      this.autoDiscLabel = 'Auto discount enabled';
      this.autoDiscount = true;
    } else {
      this.autoDiscLabel = 'Auto discount disabled';
      this.autoDiscount = false;
    }
  }

  public return() {
    this.route.navigate(['/protected/payment-policy']);
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(CustomerSearchComponent, {
      width: '550px',
      data: { show: true, },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // dialog closed
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

  public remove(customer: Customer): void {
    const index = this.customers.indexOf(customer);

    if (index >= 0) {
      this.customers.splice(index, 1);
    }
    this.dataSource = new MatTableDataSource<Customer>(this.customers);
    this.dataSource.paginator = this.paginator;
  }

  get getCustomerGroups() {
    this.selectedPGList = [];
    for (let i = 0; i < this.pgForm.value.length; i++) {
      for (let j = 0; j < this.customerGroupsList.length; j++) {
        if (this.pgForm.value[i] === this.customerGroupsList[j].id) {
          this.selectedPGList.push(this.customerGroupsList[j]);
          break;
        }
      }
    }
    const customerGroups = new FormControl(this.selectedPGList);
    return customerGroups;
  }

  get getCustomerGroupText() {
    const pg = this.getCustomerGroups;
    if (pg.value.length === 0) {
      return null;
    } else {
      return pg.value ? pg.value[0].name : '';
    }
  }

  get getCustomerGroupConcat() {
    const pg = this.getCustomerGroups;
    return `+${pg.value.length - 1} ${pg.value.length === 2 ? 'other' : 'others'}`;
  }

  get getFinancialPeriods() {
    this.selectedFPList = [];
    for (let i = 0; i < this.fpForm.value.length; i++) {
      for (let j = 0; j < this.financialPeriodsList.length; j++) {
        if (this.fpForm.value[i] === this.financialPeriodsList[j].id) {
          this.selectedFPList.push(this.financialPeriodsList[j]);
          break;
        }
      }
    }
    const financialPeriods = new FormControl(this.selectedFPList);
    return financialPeriods;
  }

  get getFinancialPeriodText() {
    const fp = this.getFinancialPeriods;
    if (fp.value.length === 0) {
      return null;
    } else {
      return fp.value ? fp.value[0].name : '';
    }
  }

  get getFinancialPeriodConcat() {
    const fp = this.getFinancialPeriods;
    return `+${fp.value.length - 1} ${fp.value.length === 2 ? 'other' : 'others'}`;
  }

  get getPaymentCycles() {
    this.selectedPCList = [];
    for (let i = 0; i < this.pcForm.value.length; i++) {
      for (let j = 0; j < this.paymentCyclesList.length; j++) {
        if (this.pcForm.value[i] === this.paymentCyclesList[j].id) {
          this.selectedPCList.push(this.paymentCyclesList[j]);
          break;
        }
      }
    }
    const paymentCycles = new FormControl(this.selectedPCList);
    return paymentCycles;
  }

  get getPaymentCycleText() {
    const pc = this.getPaymentCycles;
    if (pc.value.length === 0) {
      return null;
    } else {
      return pc.value ? pc.value[0].name : '';
    }
  }

  get getPaymentCycleConcat() {
    const pc = this.getPaymentCycles;
    return `+${pc.value.length - 1} ${pc.value.length === 2 ? 'other' : 'others'}`;
  }

  get customerGroupsChanged() {
    return (this.selectedPGList.length !== this.model.customerGroups.length);
  }

  get financialPeriodsChanged() {
    return (this.selectedFPList.length !== this.model.financialPeriods.length);
  }

  get paymentCyclesChanged() {
    return (this.selectedPCList.length !== this.model.paymentCycles.length);
  }

  get customersChanged() {
    return (this.customers.length !== this.customersUnchanged.length);
  }

}

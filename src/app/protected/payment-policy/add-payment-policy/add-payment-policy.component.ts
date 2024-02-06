import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { ToastService } from 'src/app/providers/toast.service';
import { PaymentPolicyService } from '../payment-policy.service';
import { FinancialPeriodService } from 'src/app/protected/financial-period/financial-period.service';
import { PaymentCycleService } from 'src/app/protected/payment-cycle/payment-cycle.service';
import { CustomerGroupService } from 'src/app/protected/customer-group/customer-group.service';
import { CustomerSearchComponent } from '../../customer/customer-search/customer-search.component';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { PaymentPolicyNew } from 'src/app/models/payment-policy-new.model';
import { FinancialPeriod } from 'src/app/models/financial-period.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';
import { CustomerGroup } from 'src/app/models/customer-group.model';
import { Customer } from 'src/app/models/customer.model';
import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-add-payment-policy',
  templateUrl: './add-payment-policy.component.html',
  styleUrls: ['./add-payment-policy.component.scss']
})
export class AddPaymentPolicyComponent implements OnInit {

  model: PaymentPolicyNew | any;
  companyId: string = '';
  message: string = '';
  status: boolean = false;
  autoDiscount: boolean = false;
  saveStatus: boolean = false;
  autoDiscLabel: string = '';
  busy: boolean = false;
  financialPeriodsList: FinancialPeriod[] = [];
  paymentCyclesList: PaymentCycle[] = [];
  customerGroupsList: CustomerGroup[] = [];
  subscription: Subscription;
  customer: Customer | any;
  customers: Customer[] = [];
  removable = true;
  searchText = '';
  pageSize = 10;
  page = 1;
  pageSizeOptions: number[] = [5, 10, 25];
  public claims: any;
  public btnAssignCustomerDisabled = true;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'minPercent': new FormControl(null, [Validators.required]),
    'description': new FormControl(''),
    'isActive': new FormControl,
    'autoDiscount': new FormControl,
    'financialPeriods': new FormControl({ value: null, disabled: true }),
    'paymentCycles': new FormControl({ value: null, disabled: true }),
    'customerGroups': new FormControl({ value: null, disabled: true }),
    'customers': new FormControl(null),
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

  constructor(
    public dialog: MatDialog,
    private location: Location,
    private toastService: ToastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private broadcastService: BroadcastService,
    private paymentPolicyService: PaymentPolicyService,
    private financialPeriodService: FinancialPeriodService,
    private paymentCycleService: PaymentCycleService,
    private customerGroupService: CustomerGroupService,
    private authService: AuthService,
  ) {
    this.initForm();

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

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.initialize();

    this.form.get('companyId')!.setValue(this.companyId);
    this.form.get('isActive')!.setValue(this.model.isActive);
    this.form.get('autoDiscount')!.setValue(this.model.autoDiscount);
    this.setStatus(this.model.isActive);
    this.setAutoDiscount(this.model.autoDiscount);
  }

  initialize(reload?: boolean) {
    this.customerGroupsList = [];
    this.busy = true;

    if (this.claims && this.claims.doceipt_claim_customer_access) {
      this.btnAssignCustomerDisabled = false;
    }

    if (this.claims && this.claims.doceipt_claim_financialperiod_access) {
      this.form.get('financialPeriods')!.enable();
      this.getAllFinancialPeriods(this.companyId).then((result) => {
        this.financialPeriodsList = result;
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
      this.form.get('paymentCycles')!.enable();
      this.getAllPaymentCycle(this.companyId).then((result) => {
        this.paymentCyclesList = result;
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
      this.form.get('customerGroups')!.enable();
      this.searchCustomerGroup();
      this.busy = false;
    } else {
      this.busy = false;
    }
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
  }

  initForm() {
    this.model = new PaymentPolicyNew(this.companyId);
    this.customers = [];
    this.form.reset();
    this.form.get('companyId')!.setValue(this.companyId);
    this.form.get('isActive')!.setValue(this.model.isActive);
    this.form.get('autoDiscount')!.setValue(this.model.autoDiscount);
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

  setAutoDiscount(e: any) {
    if (e) {
      this.autoDiscLabel = 'Auto Discount Enabled';
      this.autoDiscount = true;
    } else {
      this.autoDiscLabel = 'Auto Discount Disabled';
      this.autoDiscount = false;
    }
  }

  goBack() {
    this.location.back();
  }

  get getFinancialPeriods() {
    return this.form.get('financialPeriods');
  }

  get getFinancialPeriodText() {
    const fp = this.getFinancialPeriods;
    return fp!.value ? fp!.value[0].name : '';
  }

  get getFinancialPeriodConcat() {
    const fp = this.getFinancialPeriods;
    return `+${fp!.value.length - 1} ${fp!.value.length === 2 ? 'other' : 'others'}`;
  }

  get getPaymentCycles() {
    return this.form.get('paymentCycles');
  }

  get getPaymentCycleText() {
    const pc = this.getPaymentCycles;
    return pc!.value ? pc!.value[0].name : '';
  }

  get getPaymentCycleConcat() {
    const pc = this.getPaymentCycles;
    return `+${pc!.value.length - 1} ${pc!.value.length === 2 ? 'other' : 'others'}`;
  }

  get getCustomerGroups() {
    return this.form.get('customerGroups');
  }

  get getCustomerGroupText() {
    const pg = this.getCustomerGroups;
    return pg!.value ? pg!.value[0].name : '';
  }

  get getCustomerGroupConcat() {
    const pg = this.getCustomerGroups;
    return `+${pg!.value.length - 1} ${pg!.value.length === 2 ? 'other' : 'others'}`;
  }

  openDialog(): void {
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

  public rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  remove(customer: Customer): void {
    const index = this.customers.indexOf(customer);

    if (index >= 0) {
      this.customers.splice(index, 1);
    }
    this.dataSource = new MatTableDataSource<Customer>(this.customers);
    this.dataSource.paginator = this.paginator;
  }

  addPaymentPolicy(paymentPolicy: PaymentPolicyNew): Promise<any> {
    return this.paymentPolicyService.create(paymentPolicy).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as PaymentPolicyNew;
    this.model.customers = this.customers;
    if (!this.model || this.model.name.trim() === '' ||
      this.model.minPercent < 0 || this.model.minPercent > 100 || this.model.minPercent === null
    ) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }
    if (this.model.minPercent < 0 || this.model.minPercent > 100) {
      this.toastService.warning(this.messageService.paymentPolicyMinAmountWarning);
      return;
    }

    this.addPaymentPolicy(this.model).then(() => {
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

}

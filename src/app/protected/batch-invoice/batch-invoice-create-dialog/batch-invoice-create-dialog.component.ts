import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { HelperService } from 'src/app/providers/helper.service';
import { MessageService } from 'src/app/providers/message.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { CustomerGroupService } from '../../customer-group/customer-group.service';
import { BatchInvoiceService } from '../batch-invoice.service';
import { FinancialPeriodService } from '../../financial-period/financial-period.service';
import { PaymentCycleService } from '../../payment-cycle/payment-cycle.service';

import { BatchInvoiceNew } from 'src/app/interfaces/batch-invoice-new';
import { FinancialPeriod } from 'src/app/interfaces/financial-period';
import { PaymentCycle } from 'src/app/interfaces/payment-cycle';
import { CustomerGroup } from 'src/app/interfaces/customer-group';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { ImportStatus } from 'src/app/models/import-status.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { SearchResult } from 'src/app/interfaces/search-result';

export interface DialogData {
  show: boolean;
}

@Component({
  selector: 'app-batch-invoice-create-dialog',
  templateUrl: './batch-invoice-create-dialog.component.html',
  styleUrls: ['./batch-invoice-create-dialog.component.scss']
})

export class BatchInvoiceCreateDialogComponent implements OnInit {

  busy: boolean = false;
  companyId: string = '';
  financialPeriods: FinancialPeriod[] = [];
  paymentCycles: PaymentCycle[] = [];
  customerGroupList: CustomerGroup[] = [];
  public claims: any;
  public today: any;
  interval: any;
  importStatus!: ImportStatus;
  broadcastObj!: BroadcastMessage;
  public financialPeriodName = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public financialPeriodExists: boolean = false;
  public selectedFinancialPeriod!: FinancialPeriod;
  public paymentCycleName = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public paymentCycleExists: boolean = false;
  public selectedPaymentCycle!: PaymentCycle;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'customerGroupId': new FormControl(''),
    'customerGroups': new FormControl({ value: null, disabled: true }, [Validators.required]),
    'invoiceDate': new FormControl(null, [Validators.required]),
    'invoiceDueDate': new FormControl(null),
  });

  currentCount: number | any;
  totalCount: number | any;
  batchGenerateMessage: string = '';
  status: any[] = [];
  errors: any[] = [];
  results: any[] = [];
  searchText = '';
  pageSize = 10;
  pages: number | any;
  page = 1;
  sortOrder = 'asc';
  runningCustomerGroups: boolean = true;
  runningFinancials: boolean = true;
  runningPaymentCycles: boolean = true;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BatchInvoiceCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public storageService: StorageService,
    public financialPeriodService: FinancialPeriodService,
    public paymentCycleService: PaymentCycleService,
    public customerGroupService: CustomerGroupService,
    public batchInvoiceService: BatchInvoiceService,
    public toastService: ToastService,
    public helper: HelperService,
    private messageService: MessageService,
    private authService: AuthService,
    private broadcastService: BroadcastService,
  ) {
  }

  async ngOnInit() {
    this.today = new Date();
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.customerGroupList = [];

    this.form.get('companyId')!.setValue(this.companyId);

    // search financial period after every key stroke
    this.financialPeriodName.valueChanges
      .subscribe(value => {
        if (value.length >= 1) {
          this.searchFinancialPeriod(value)
            .then((result: SearchResult) => {
              this.financialPeriods = result.data;
              this.financialPeriodValidator();
              this.financialPeriodName.updateValueAndValidity({ emitEvent: false });
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

    if (this.claims && this.claims.doceipt_claim_financialperiod_access) {
      // this.form.get('financialPeriodId')!.enable();
      this.financialPeriodName.enable();
      this.searchFinancialPeriod(" ")
        .then((result: SearchResult) => {
          this.financialPeriods = result.data;
          this.runningFinancials = false;
        }, error => { this.runningFinancials = false; });
    } else {
      this.runningFinancials = false;
    }

    if (this.claims && this.claims.doceipt_claim_paymentcycle_access) {
      this.paymentCycleName.enable();
      this.searchPaymentCycle(" ")
        .then((result: SearchResult) => {
          this.paymentCycles = result.data;
          this.runningPaymentCycles = false;
        }, error => { this.runningPaymentCycles = false; })
    } else {
      this.runningPaymentCycles = false;
    }

    if (this.claims && this.claims.doceipt_claim_customergroup_access) {
      this.form.get('customerGroups')!.enable();
      this.customerGroupList = await this.customerGroupService.getAll(this.companyId, this.page, this.pageSize);
      this.runningCustomerGroups = false;
    } else {
      this.runningCustomerGroups = false;
    }
  }

  public searchFinancialPeriod(value: string): Promise<any> {
    return this.financialPeriodService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public searchPaymentCycle(value: string): Promise<any> {
    return this.paymentCycleService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public getRunningTasks(): boolean {
    return (this.runningCustomerGroups || this.runningFinancials || this.runningPaymentCycles || this.busy) === true;
  }

  invDateFilter = (d: Date | null): boolean => {
    // Prevent date outside financial period from being selected.
    const fPeriodName = this.financialPeriodName.value;
    const fPeriod = this.financialPeriods.filter((element) => element.name === fPeriodName)[0];
    
    let startDate;
    let endDate;

    if (!fPeriod) {
      // handle null parameter. use current date if null
      startDate = this.helper.date.getTime();
      endDate = this.helper.date.getTime();
    } else {
      startDate = this.helper.getDate(fPeriod.startDate).getTime();
      endDate = this.helper.getDate(fPeriod.endDate).getTime();
    }

    let day;
    if (!d) {
      // handle null parameter
      day = startDate;
    } else {
      day = d!.getTime();
    }

    return day >= startDate && day <= endDate;
  }

  invDueDateFilter = (d: Date | null): boolean => {
    // Prevent date earlier than invoice date from being selected.
    const invoiceDate = this.getInvoiceDate!.value;
    const startDate = this.helper.getDate(invoiceDate).getTime();
    let day;
    if (!d) {
      day = startDate;
    } else {
      day = d!.getTime();
    }

    return day >= startDate;
  }

  onInvoiceDate(type: string, event: MatDatepickerInputEvent<Date>) {
    const invoiceDate = event.value;
    const invoiceDueDate = this.getInvoiceDueDate;

    if (invoiceDate && invoiceDueDate!.value && invoiceDueDate!.value !== '') {
      const invDateTime = invoiceDate.getTime();
      const dueDateTime = this.helper.getDate(invoiceDueDate!.value).getTime();

      if (invDateTime > dueDateTime) {
        invoiceDueDate!.setErrors({ incorrect: true });
      } else {
        invoiceDueDate!.setErrors(null);
      }
    } else {
      invoiceDueDate!.setErrors(null);
    }
  }

  getRequiredErrorMessage(field: string) {
    return this.form.get(field)!.hasError('required') ? 'You must enter a value' : '';
  }

  getDueDateErrorMessage() {
    return this.getInvoiceDueDate!.hasError('incorrect') ? 'Invoice due date is less than invoice date' : '';
  }

  // getCycleError() {
  //   return this.getPaymentCycle!.hasError('required') ? 'You must enter a value' : '';
  // }

  get getInvoiceDate() {
    return this.form.get('invoiceDate');
  }

  // get getFinancialPeriod() {
  //   return this.form.get('financialPeriodId');
  // }

  get getInvoiceDueDate() {
    return this.form.get('invoiceDueDate');
  }

  // get getPaymentCycle() {
  //   return this.form.get('paymentCycleId');
  // }

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

  clearCtrlValue(ctrl: any) {
    ctrl!.setValue('');
  }

  async onSubmit() {
    this.busy = true;
    this.data.show = false;
    const model = this.form.value as BatchInvoiceNew;

    model.financialPeriodId = this.selectedFinancialPeriod.id;
    model.paymentCycleId = this.selectedPaymentCycle.id;

    this.batchGenerateMessage = 'Generating batch invoice...';

    
    // add timezone offset
    model.invoiceDate = this.helper.getDateString(this.helper.getDate(model.invoiceDate)) + this.helper.getTimezoneOffset;
    if (model.invoiceDueDate && model.invoiceDueDate !== '') {
      model.invoiceDueDate = this.helper.getDateString(this.helper.getDate(model.invoiceDueDate)) + this.helper.getTimezoneOffset;
    }
    
    const customerGroups: any[] = this.getCustomerGroups!.value;
    this.totalCount = customerGroups.length;
    this.currentCount = 0;
    this.status = [];
    this.errors = [];
    this.results = [];

    for (let index = 0; index < customerGroups.length; index++) {

      const element = customerGroups[index];
      this.status.push(0);
      model.customerGroupId = element.id;

      try {
        const value = await this.batchInvoiceService.create(model).toPromise();
        this.results.push(value);
        this.status[index] = 1;
        this.errors.push(null);

      } catch (error) {
        this.status[index] = -1;
        this.results.push(null);
        this.errors.push(error);
      }

      this.currentCount += 1;
    }

    this.busy = false;
    const errors = this.errors.filter(e => e);
    this.batchGenerateMessage = errors.length > 0 ? errors[0] : `Batch invoice completed successfully.`;
  }

  getRowCount(i: number) {
    const result = this.results[i];
    if (result && result.invoicesCount) {
      return result.invoicesCount;
    }

    return '';
  }

  getBusyStatus(i: number) {
    const status = this.status[i];
    return status ? (status === 0 ? true : false) : true;
  }

  getStatus(i: number, isSuccess: boolean) {
    const status = this.status[i];
    return status ? (status === 0 ? false : (status === -1 ? !isSuccess : isSuccess)) : false;
  }

  getImportCustomerConfirm() {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Do you want to import customers before generating batch invoice? <br>`,
        input: 'import',
      },
    });
  }

  openImportCustomerConfirm() {
    if (this.form.invalid || !this.financialPeriodExists || !this.paymentCycleExists) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    if (this.claims && this.claims.doceipt_user_isOwner) {
      const dialogRef = this.getImportCustomerConfirm();

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'import') {
          // start importing
          this.initiateImportCustomer();
        } else {
          // start creating batch invoice
          this.onSubmit();
        }
      });
    } else {
      this.onSubmit();
    }
  }

  public initiateImportCustomer() {
    this.busy = true;
    let customerImportInitalizer = new BroadcastMessage(this.messageService.customerImportSender, this.companyId);
    this.broadcastService.broadcastTask(customerImportInitalizer);
  }

  public closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  public financialPeriodValidator(): any {
    this.financialPeriodExists = false;
    let fp = this.financialPeriodName.value;
    for (let i = 0; i < this.financialPeriods.length; i++) {
      if (this.financialPeriods[i].name === fp) {
        this.financialPeriodExists = true;
        this.selectedFinancialPeriod = this.financialPeriods[i];
        this.financialPeriodName.clearValidators();
      }
    }
    if (!this.financialPeriodExists) {
      this.financialPeriodExists = false;
      this.financialPeriodName.setValidators(f => <any>{ notvalid: true });
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
      this.pages = false;
      this.paymentCycleName.setValidators(f => <any>{ notvalid: true });
    }
  }

}

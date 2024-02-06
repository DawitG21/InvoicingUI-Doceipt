import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';

import { Customer } from 'src/app/models/customer.model';
import { ServiceFee } from 'src/app/models/service-fee.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';
import { FinancialPeriod } from 'src/app/models/financial-period.model';
import { InvoiceNew } from 'src/app/models/invoice-new.model';
import { InvoiceSearchModel } from 'src/app/models/invoice-search.model';
import { CustomerSearch } from 'src/app/models/customer-search.model';

import { CustomerService } from '../../customer/customer.service';
import { ServiceFeeService } from '../../service-fee/service-fee.service';
import { PaymentCycleService } from '../../payment-cycle/payment-cycle.service';
import { FinancialPeriodService } from '../../financial-period/financial-period.service';
import { InvoiceService } from '../invoice.service';
import { ToastService } from 'src/app/providers/toast.service';
import { HelperService } from 'src/app/providers/helper.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { InvoiceCalculationsService } from '../invoice-calculatons.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ConsoleService } from 'src/app/providers/console.service';
import { SpinnerService } from 'src/app/providers/spinner.service';

declare var $: any;
import * as _ from 'lodash';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { CustomerSearchComponent } from '../../customer/customer-search/customer-search.component';
import { InvoicePreviewComponent } from '../invoice-preview/invoice-preview.component';
import { AddServiceDialogComponent } from '../add-service-dialog/add-service-dialog.component';

import { SearchResult } from 'src/app/interfaces/search-result';
import { CustomerDueInvoiceComponent } from '../customer-dueInvoice/customer-dueInvoice.component';
import { Invoice } from 'src/app/models/invoice.model';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})

export class AddInvoiceComponent implements OnInit, OnDestroy {

  total = 0;
  claims: any;
  dueDate: any;
  endDate: any;
  startDate: any;
  openRibbon = true;
  companyId: string = '';
  searchText: string = '';
  searchFilter: CustomerSearch;
  paymentCycleId: string = '';
  customerGroupId: string = '';
  customer: Customer | any;
  model: InvoiceNew | any;
  subscription: Subscription;
  financialPeriod: FinancialPeriod | any;
  financialPeriods: FinancialPeriod[] = [];
  invoiceValidationObj: InvoiceSearchModel | any;
  serviceFees: Array<any> = [];
  paymentCycles: PaymentCycle[] = [];
  selectedServices: any = [];
  pipeSelectedServices: any = [];
  allServiceFees: Array<ServiceFee> = [];
  status: boolean = false;
  message: string = '';
  page = 1;
  pageSize = 10;
  sortOrder = 'asc';
  public busy: boolean = false;
  public customerSearcDisabled = true;
  public btnAddServiceDisabled = true;
  public btnPreviewDisabled = true;
  public saveStatus: boolean = false;
  public today: any;
  public financialPeriodName = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public financialPeriodExists: boolean = false;
  public selectedFinancialPeriod!: FinancialPeriod;
  public paymentCycleName = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public paymentCycleExists: boolean = false;
  public selectedPaymentCycle!: PaymentCycle;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'invoiceNumber': new FormControl(''),
    'invoiceDate': new FormControl(null, [Validators.required]),
    'invoiceDueDate': new FormControl(null),
    'customerId': new FormControl({ value: '', disabled: true }, [Validators.required]),
    'financialPeriodId': new FormControl({ value: '', disabled: true }, [Validators.required]),
    'paymentCycleId': new FormControl({ value: '', disabled: true }, [Validators.required]),
    'autoGenerate': new FormControl(true),
  });

  getErrorMessage(field: string) {
    return this.form.get(field)!.hasError('required') ? 'You must enter a value' : '';
  }

  get getAutoGenerate() {
    return this.form.get('autoGenerate');
  }

  get getCustomer() {
    return this.form.get('customerId');
  }

  getRequiredErrorMessage(field: string) {
    return this.form.get(field)!.hasError('required') ? 'You must enter a value' : '';
  }

  get getInvoiceDate() {
    return this.form.get('invoiceDate');
  }

  get getInvoiceDueDate() {
    return this.form.get('invoiceDueDate');
  }

  getDueDateErrorMessage() {
    return this.getInvoiceDueDate!.hasError('incorrect') ? 'Invoice due date is less than invoice date' : '';
  }

  constructor(
    private financialPeriodService: FinancialPeriodService,
    private paymentCycleService: PaymentCycleService,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private serviceFeeService: ServiceFeeService,
    private broadcastService: BroadcastService,
    private toastService: ToastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private helperService: HelperService,
    private authService: AuthService,
    private route: Router,
    public dialog: MatDialog,
    private invoiceCalculations: InvoiceCalculationsService,
    private consoleService: ConsoleService,
    private spinner: SpinnerService,
  ) {
    this.initForm();
    this.searchFilter = new CustomerSearch();

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.customerSearchSender) {
          this.customer = message.data;
          this.model.customerId = this.customer.id;
          this.form.get('customerId')!.setValue(this.customer.id);
          this.customerGroupId = this.customer.customerGroup.id;
          if (this.claims && this.claims.doceipt_claim_invoice_access) {
            this.getDueInvoices(this.customer);
          }
          /*    if a customer is changed while creating an invoice, clear the following: */
          this.allServiceFees = [];
          this.selectedServices = [];
          this.serviceFees = [];
        }
      });

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.initialize();
    this.setInvoiceNumber(this.model.autoGenerate);
    this.today = new Date();

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
  }

  initForm() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.model = new InvoiceNew(this.companyId);
    this.form.reset();
    this.form.get('companyId')!.setValue(this.companyId);
    this.model.invoiceDate = this.helperService.getDateNewString;

    const dueDate = this.helperService.getDate(this.helperService.date.toDateString());
    dueDate.setDate(this.helperService.date.getDate() + 30);
    this.dueDate = this.helperService.getDateString(dueDate);
    this.model.invoiceDueDate = this.dueDate;
    this.customer = new Customer();
    this.selectedServices = [];
    this.pipeSelectedServices = [];
  }

  setInvoiceNumber(e: any) {
    if (e) {
      this.message = 'Auto Generate';
      this.status = true;
      this.form.get('autoGenerate')!.setValue(this.status);
      this.form.get('invoiceNumber')!.setValue('');
      this.form.controls.invoiceNumber.disable();
    } else {
      this.message = 'Enter Manually';
      this.status = false;
      this.form.get('autoGenerate')!.setValue(this.status);
      this.form.controls.invoiceNumber.enable();
    }
  }

  initialize() {
    this.busy = true;
    if (this.claims && this.claims.doceipt_claim_financialperiod_access) {
      this.financialPeriodName!.enable();
      this.searchFinancialPeriod(" ").then((res: SearchResult) => {
        this.financialPeriods = res.data;
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
      this.paymentCycleName.enable();
      this.loadPaymentCycles();
    }

    if (this.claims && this.claims.doceipt_claim_customer_access) {
      this.form.get('customerId')!.enable();
      this.customerSearcDisabled = false;
    }
  }

  public searchFinancialPeriod(value: string): Promise<any> {
    return this.financialPeriodService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public searchPaymentCycle(value: string): Promise<any> {
    return this.paymentCycleService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public loadPaymentCycles(): void {
    this.busy = true;
    this.searchPaymentCycle(" ").then((res: SearchResult) => {
      this.paymentCycles = res.data;
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

  changeRibbonState() {
    if (this.openRibbon === true) {
      this.openRibbon = false;
    } else {
      this.openRibbon = true;
    }
  }

  public search(companyId: string): Promise<any> {
    return this.invoiceService.search(companyId, this.invoiceValidationObj).toPromise();
  }

  public searchInvoice(): void {
    this.busy = true;
    this.search(this.companyId).then((result: SearchResult) => {
      if (result.data.length > 0) {
        this.openConfirmDialog();
      } else {
        this.addInvoiceFees();
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

  validateInvoiceFees() {
    if (!this.customer.name || this.customer.name.trim() === '' ||
      !this.financialPeriodExists || !this.paymentCycleExists
    ) {
      this.toastService.warning(this.messageService.mandatoryFields);
    } else {
      if (!this.claims || !this.claims.doceipt_claim_servicefee_access) {
        this.toastService.error(this.messageService.NO_ENOUGH_PERMISSION);
        return;
      }
      this.allServiceFees = [];
      this.invoiceValidationObj = new InvoiceSearchModel();
      this.invoiceValidationObj.customer = this.customer.name;
      this.invoiceValidationObj.customerGroupId = this.customerGroupId;
      this.invoiceValidationObj.paymentCycleId = this.selectedPaymentCycle.id;
      this.invoiceValidationObj.financialPeriodId = this.selectedFinancialPeriod.id;

      this.searchInvoice();
    }
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '450px',
      maxWidth: '620px',
      data: { message: `An invoice with the similar services has already been made! Do you wish to proceed?`, input: true },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.claims && this.claims.doceipt_claim_invoice_create_duplicate) {
          this.addInvoiceFees();
        } else {
          this.toastService.warning(this.messageService.NO_ENOUGH_PERMISSION);
        }
      }
    });
  }

  public async searchServiceFees(customerGroupId: string, paymentCycleId: string, active?: boolean,): Promise<any> {
    // return this.serviceFeeService.search(this.companyId, this.searchText,
    //   this.page, this.pageSize, this.sortOrder, customerGroupId, paymentCycleId, active).toPromise();
    return await this.serviceFeeService.getAll(this.companyId,
      this.page, this.pageSize, customerGroupId, paymentCycleId);
  }

  public async getAllServiceFees() {
    this.busy = true;
    await this.serviceFeeService.getAll(this.companyId, this.page, this.pageSize, this.customerGroupId, this.paymentCycleId).then((result) => {
    //this.searchServiceFees(this.customerGroupId, this.paymentCycleId, true).then((result: SearchResult) => {
      for (let i = 0; i < result.length; i++) {
        this.allServiceFees.push(result[i]);
      }
      this.serviceFees = this.invoiceService.createModifiedObjects(this.allServiceFees);
      if (this.serviceFees.length > 0) {
        this.btnAddServiceDisabled = false;
      }
      this.consoleService.consoleMessage(this.serviceFees);
      for (let i = 0; i < this.serviceFees.length; i++) {
        let matched = 0;
        if (this.serviceFees[i].service.mandatory === true) {
          if (this.selectedServices.length === 0) {
            this.selectedServices.push(this.serviceFees[i]);
            this.btnPreviewDisabled = false;
          } else {
            for (let j = 0; j < this.selectedServices.length; j++) {
              if (this.serviceFees[i].id === this.selectedServices[j].id) {
                matched = 1;
                break;
              }
            }
            if (matched === 0) {
              this.selectedServices.push(this.serviceFees[i]);
            }
          }
        }
      }
      this.pipeSelectedServices = _.chain(this.selectedServices)
        .groupBy('paymentCycle.name')
        .map((value, key) => ({ key, value }))
        .value();
      this.calculateTotal();
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

  addInvoiceFees() {
    this.serviceFees = [];
    this.allServiceFees = [];
    this.getAllServiceFees();
  }

  isServiceChosen(obj: { invoiceFee: { serviceFeeId: any; }; id: any; checked: boolean; }) {
    obj.invoiceFee.serviceFeeId = obj.id;
    if (obj.checked === true) {
      let matched = 0;
      for (const service of this.selectedServices) {
        if (service.id === obj.id) {
          matched = 1;
        }
      }
      if (matched === 0) {
        this.selectedServices.push(obj);
        this.pipeSelectedServices = _.chain(this.selectedServices)
          .groupBy('paymentCycle.name')
          .map((value, key) => ({ key, value }))
          .value();
      } else {
        matched = 0;
      }
    } else {
      for (let i = 0; i < this.selectedServices.length; i++) {
        if (this.selectedServices[i].id === obj.id) {
          this.selectedServices.splice(i, 1);
          this.pipeSelectedServices = _.chain(this.selectedServices)
            .groupBy('paymentCycle.name')
            .map((value, key) => ({ key, value }))
            .value();
        }
      }
    }
    this.calculateTotal();
  }

  public create(model: InvoiceNew): Promise<any> {
    return this.invoiceService.create(model).toPromise();
  }

  public createInvoice(): void {
    this.spinner.show();
    this.saveStatus = true;
    if (this.form.get('invoiceDate')!.value) {
      this.model.invoiceDate = this.helperService.getDateString(this.form.get('invoiceDate')!.value);
    }
    // add timezone offset
    this.model.invoiceDate += this.helperService.getTimezoneOffset;

    if (this.form.get('invoiceDueDate')!.value) {
      this.model.invoiceDueDate = this.helperService.getDateString(this.form.get('invoiceDueDate')!.value);
    }
    if (this.model.invoiceDueDate && this.model.invoiceDueDate !== '') {
      this.model.invoiceDueDate += this.helperService.getTimezoneOffset;
    }

    if (!this.financialPeriodExists || !this.paymentCycleExists) {
      this.toastService.warning(this.messageService.mandatoryFields);
      this.busy = false;
      this.saveStatus = false;
      return;
    }
    this.model.financialPeriodId = this.selectedFinancialPeriod.id;
    this.model.paymentCycleId = this.selectedPaymentCycle.id;

    this.create(this.model).then(() => {
      this.initForm();
      this.toastService.success('Operation Succesful');
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
        this.spinner.hide();
        this.saveStatus = false;
      });
  }

  save() {
    for (let j = 0; j < this.selectedServices.length; j++) {
      const invoiceFee2 = {
        'serviceFeeId': this.selectedServices[j].id,
        'quantity': this.selectedServices[j].invoiceFee.quantity,
        'discounts': this.selectedServices[j].invoiceFee.discounts
      };
      this.model.invoiceFees.push(invoiceFee2);
    }
    this.calculateTotal();
    this.createInvoice();
  }

  public openSaveDialog() {
    if (this.selectedServices.length === 0) {
      this.toastService.warning(this.messageService.NO_SERVICE_SELECTED);
      return;
    } else {
      const dialogRef = this.getSaveDialog();

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'save') {
          this.save();
        }
      });
    }
  }

  public getSaveDialog() {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: 'save',
        message: `Are you sure you want to save the invoice?<br>`,
      },
      width: '450px',
    });
  }

  openInvoicePreview(): void {
    let paymentCycleobj = {};
    for (let i = 0; i < this.paymentCycles.length; i++) {
      if (this.paymentCycleId === this.paymentCycles[i].id) {
        paymentCycleobj = this.paymentCycles[i];
      }
    }
    this.model.invoiceNumber = this.form.get('invoiceNumber')!.value;
    const invoiceDetail = {
      customer: this.customer,
      invoice: this.model,
      services: this.selectedServices,
      amountDue: this.total,
      paymentCycle: paymentCycleobj,
      financialPeriod: this.selectedFinancialPeriod
    };
    const dialogRef = this.dialog.open(InvoicePreviewComponent, {
      width: '1000px',
      data: { show: true, message: invoiceDetail },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

  public ServiceRemoved(obj: { invoiceFee: { serviceFeeId: any; }; id: any; checked: boolean; }) {
    obj.checked = false;
    this.isServiceChosen(obj);
  }

  customTrackBy(index: number): any {
    return index;
  }

  calculateTotal() {
    this.total = 0;
    for (let i = 0; i < this.selectedServices.length; i++) {
      this.total = this.total + this.selectedServices[i].totalAmount;
    }
  }

  addDiscounts(obj: {
    invoiceFee: {
      discounts: number[]; discountedAmounts: number[];
      serviceFeeId: any;
    }; id: any; netDiscounts: number[];
  }) {
    this.invoiceCalculations.addDiscounts(obj);
  }

  deleteDiscount(obj: any, index: any) {
    this.invoiceCalculations.deleteDiscount(obj, index);
    this.calculateTotal();
  }

  calculateDiscounts() {
    this.serviceFees = this.invoiceService.calculateDiscounts(this.serviceFees);
    this.calculateTotal();
  }

  updateQuantity(obj: {
    taxInclusive: any; amountAfterTax: any; amountAfterQuantity: any;
    totalTaxes: any; taxes: any; netTaxes: any; amountAfterTaxDiscountAndQuantity: any;
    amountAfterDiscount: any; amount?: any; invoiceFee?: any; totalAmount?: any;
  }, index: any) {
    this.selectedServices[index] = this.invoiceCalculations.updateQuantity(obj, this.serviceFees);
    this.calculateTotal();
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

  invDateFilter = (d: Date | null): boolean => {
    // Prevent date outside financial period from being selected.
    const fPeriodName = this.financialPeriodName.value;
    const fPeriod = this.financialPeriods.filter((element) => element.name === fPeriodName)[0];
    const startDate = this.helperService.getDate(fPeriod.startDate).getTime();
    const endDate = this.helperService.getDate(fPeriod.endDate).getTime();
    const day = d!.getTime();

    return day >= startDate && day <= endDate;
  }

  invDueDateFilter = (d: Date | null): boolean => {
    // Prevent date earlier than invoice date from being selected.
    //const invoiceDate = this.model.invoiceDate;
    const invoiceDate = this.getInvoiceDate!.value;
    const startDate = this.helperService.getDate(invoiceDate).getTime();
    //const day = d!.getTime();
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
      const dueDateTime = this.helperService.getDate(invoiceDueDate!.value).getTime();

      if (invDateTime > dueDateTime) {
        invoiceDueDate!.setErrors({ incorrect: true });
      } else {
        invoiceDueDate!.setErrors(null);
      }
    } else {
      invoiceDueDate!.setErrors(null);
    }
  }

  public addServicesDialog() {
    return this.dialog.open(AddServiceDialogComponent, {
      data: { input: this.serviceFees },
      width: '500px',
    });
  }

  public openAddServicesDialog() {
    const dialogRef = this.addServicesDialog();

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.length !== 0) {
        for (const invoiceFeeObject of result) {
          this.isServiceChosen(invoiceFeeObject);
        }
      }
    });
  }

  public dueInvoiceGet(id: string): Promise<any> {
    return this.customerService.getDueInvoices(id).toPromise();
  }

  public getDueInvoices(customerObj: Customer) {
    this.busy = true;
    let dueInvoicesArray = [];
    this.dueInvoiceGet(customerObj.id).then((res: Invoice[]) => {
      if (res.length > 0) {
        if (this.model.financialPeriodId) {
          const newArray = [];
          for (const inv of res) {
            if (inv.financialPeriod.id === this.model.financialPeriodId) {
              newArray.push(inv);
            }
          }
          dueInvoicesArray = newArray;
        } else {
          dueInvoicesArray = res;
        }

        if (dueInvoicesArray.length > 0) {
          const data = {
            customer: customerObj,
            dueInvoices: dueInvoicesArray,
          };
          this.openDueInvoicePreviewDialog(data);
        }
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

  public openDueInvoicePreviewDialog(data: any): void {
    const dialogRef = this.dialog.open(CustomerDueInvoiceComponent, {
      data: { show: true, message: data },
      disableClose: true,
      width: '550px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // customer preview dialog closed
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

  public financialPeriodValidator(): any {
    this.financialPeriodExists = false;
    let fp = this.financialPeriodName.value;
    for (let i = 0; i < this.financialPeriods.length; i++) {
      if (this.financialPeriods[i].name === fp) {
        this.financialPeriodExists = true;
        this.selectedFinancialPeriod = this.financialPeriods[i];
        this.financialPeriod = this.selectedFinancialPeriod;
        this.startDate = this.financialPeriod.startDate;
        this.endDate = this.financialPeriod.endDate;
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
        this.paymentCycleId = this.selectedPaymentCycle.id;
        this.paymentCycleName.clearValidators();
      }
    }
    if (!this.paymentCycleExists) {
      this.paymentCycleExists = false;
      this.paymentCycleId = " ";
      this.paymentCycleName.setValidators(f => <any>{ notvalid: true });
    }
  }
}

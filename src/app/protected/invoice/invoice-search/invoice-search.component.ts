import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { FinancialPeriodService } from '../../financial-period/financial-period.service';
import { PaymentCycleService } from '../../payment-cycle/payment-cycle.service';
import { CustomerGroupService } from '../../customer-group/customer-group.service';
import { BranchService } from '../../branch/branch.service';
import { InvoiceService } from '../invoice.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { ToastService } from 'src/app/providers/toast.service';
import { HelperService } from 'src/app/providers/helper.service';

import { InvoiceSearchModel } from 'src/app/models/invoice-search.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

import * as $ from "jquery";
import { SearchResult } from 'src/app/interfaces/search-result';
import { FinancialPeriod } from 'src/app/models/financial-period.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';

@Component({
  selector: 'app-invoice-search',
  styleUrls: ['./invoice-search.component.scss'],
  templateUrl: './invoice-search.component.html',
})

export class InvoiceSearchComponent implements OnInit {

  public companyId = '';
  public financialPeriods: any = [];
  public paymentCycles: any = [];
  public customerGroups: any = [];
  public branches: any = [];
  public searchResult: any;
  public invoices: any = [];
  public pageSize = 10;
  public busy: boolean = false;
  public claims: any;
  public sortOrder = 'asc';
  public page = 1;
  public pageSizeOptions: number[] = [5, 10, 25];
  public searchText = '';
  public pages: number | any;
  public showActive: boolean = true;
  public message: string = '';
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator | any;
  public financialPeriodName = new FormControl({ value: '', disabled: true });
  public financialPeriodExists: boolean = false;
  public selectedFinancialPeriod!: FinancialPeriod;
  public paymentCycleName = new FormControl({ value: '', disabled: true });
  public paymentCycleExists: boolean = false;
  public selectedPaymentCycle!: PaymentCycle;

  public model: InvoiceSearchModel | any;
  public form = new FormGroup({
    branchId: new FormControl({ value: '', disabled: true }),
    customer: new FormControl(''),
    customerGroupId: new FormControl({ value: '', disabled: true }),
    fromDate: new FormControl(''),
    invoiceNumber: new FormControl(''),
    payment: new FormControl(''),
    receipt: new FormControl(''),
    toDate: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<InvoiceSearchComponent>,
    public dialog: MatDialog,
    public toastService: ToastService,
    private financialPeriodService: FinancialPeriodService,
    private paymentCycleService: PaymentCycleService,
    private customerGroupService: CustomerGroupService,
    private branchService: BranchService,
    private invoiceService: InvoiceService,
    private storageService: StorageService,
    private messageService: MessageService,
    private broadcastService: BroadcastService,
    private helperService: HelperService,
    private authService: AuthService,
  ) { }

  public ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.changeToggleState(true);
    this.customerGroups = [];
    this.branches = [];

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
          this.financialPeriodName.clearValidators();
          this.financialPeriodName.updateValueAndValidity({ emitEvent: false });
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
          this.paymentCycleName.clearValidators();
          this.paymentCycleName.updateValueAndValidity({ emitEvent: false });
          return null;
        }
      });

    if (this.claims && this.claims.doceipt_claim_customergroup_access) {
      this.form.get('customerGroupId')!.enable();
      this.searchCustomerGroup();
    }

    if (this.claims && this.claims.doceipt_claim_financialperiod_access) {
      this.financialPeriodName.enable();
      this.getAllFinancialPeriods();
    }

    if (this.claims && this.claims.doceipt_claim_paymentcycle_access) {
      this.paymentCycleName.enable();
      this.getAllPaymentCycles();
    }

    if (this.claims && this.claims.doceipt_claim_branch_access) {
      this.form.get('branchId')!.enable();
      this.searchBranch();
    }

  }

  public changeToggleState(e: any) {
    if (e) {
      this.message = 'Show Active Only';
      this.showActive = true;
    } else {
      this.message = 'Show All';
      this.showActive = false;
    }

    if (this.claims && this.claims.doceipt_claim_financialperiod_access) {
      this.getAllFinancialPeriods();
    }
    if (this.claims && this.claims.doceipt_claim_paymentcycle_access) {
      this.getAllPaymentCycles();
    }
  }

  public rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  private async searchCustomerGroup() {
    await this.customerGroupService.getAll(this.companyId, 1, this.pageSize).then((result) => {
      this.customerGroups = result;
    });
  }

  private async searchBranch() {
    await this.branchService.getAll(this.companyId, 1, this.pageSize).then((result) => {
      this.branches = result;
    });
  }

  public searchFinancialPeriod(value: string): Promise<any> {
    return this.financialPeriodService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, this.showActive).toPromise();
  }

  public getAllFinancialPeriods(): void {
    this.busy = true;
    this.searchFinancialPeriod(this.financialPeriodName.value).then((result: SearchResult) => {
      this.financialPeriods = result.data;
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
    return this.paymentCycleService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, this.showActive).toPromise();
  }

  public getAllPaymentCycles(): void {
    this.busy = true;
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

  public search(companyId: string, model: InvoiceSearchModel): Promise<any> {
    return this.invoiceService.searchInvoice(companyId, model, this.page, this.pageSize, 'asc').toPromise();
  }

  public searchInvoice() {
    this.busy = true;
    this.model = this.form.value as InvoiceSearchModel;
    // if (this.financialPeriodExists) {
    //   this.model.financialPeriodId = this.selectedFinancialPeriod.id;
    // } else {
    //   this.model.financialPeriodId = "";
    // }
    this.financialPeriodExists ? this.model.financialPeriodId = this.selectedFinancialPeriod.id : this.model.financialPeriodId = "";
    this.paymentCycleExists ? this.model.paymentCycleId = this.selectedPaymentCycle.id : this.model.paymentCycleId = "";

    if (this.model.fromDate !== '') {
      this.model.fromDate = this.helperService.getDateString(this.helperService.getDate(this.model.fromDate));
    }
    if (this.model.toDate !== '') {
      this.model.toDate = this.helperService.getDateString(this.helperService.getDate(this.model.toDate));
    }
    this.invoices = [];
    this.search(this.companyId, this.model).then((result: SearchResult) => {
      this.searchResult = result;
      $('#DebugContainer').stop().animate({
        scrollTop: $('#DebugContainer')[0].scrollHeight,
      }, 800);
      this.invoices = this.searchResult.data;
      this.rePaginate(result.rows, result.page - 1);
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

  public pageEvent(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.searchInvoice();
  }

  public selectInvoice(invoice: any) {
    if (invoice.voided) {
      this.toastService.warning(this.messageService.invoiceVoidedWarningSender);
      return;
    } else if (!invoice.customer.isActive) {
      this.openCustomerInactiveDialog(invoice);
    } else {
      const message = new BroadcastMessage(this.messageService.invoiceSelectSender, invoice);
      this.broadcastService.broadcastTask(message);
      this.resetInvoiceList();
      this.dialogRef.close();
    }
  }

  public resetInvoiceList() {
    this.invoices = [];
  }

  public openCustomerInactiveDialog(invoice: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: true,
        message: `The customer of the invoice you selected is not active! Do you wish to proceed?`,
      },
      disableClose: true,
      maxWidth: '620px',
      minWidth: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const message = new BroadcastMessage(this.messageService.invoiceSelectSender, invoice);
        this.broadcastService.broadcastTask(message);
        this.resetInvoiceList();
        this.dialogRef.close();
      }
    });
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
      this.paymentCycleExists = false;
      this.paymentCycleName.setValidators(f => <any>{ notvalid: true });
    }
  }

}

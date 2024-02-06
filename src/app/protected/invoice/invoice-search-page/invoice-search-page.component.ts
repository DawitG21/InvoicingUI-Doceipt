import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FinancialPeriodService } from '../../financial-period/financial-period.service';
import { PaymentCycleService } from '../../payment-cycle/payment-cycle.service';
import { BranchService } from '../../branch/branch.service';
import { InvoiceService } from '../invoice.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { AuthService } from 'src/app/core/authentication/auth.service';

import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceFeeModified } from 'src/app/models/invoice-fee-modified.model';
import { InvoiceSearchModel } from 'src/app/models/invoice-search.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { CustomerGroup } from 'src/app/models/customer-group.model';

declare var $: any;

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SearchResult } from 'src/app/interfaces/search-result';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { IndexInvoicePreviewComponent } from '../index-invoice-preview/index-invoice-preview.component';
import { CustomerGroupSearchComponent } from '../../customer-group/customer-group-search/customer-group-search.component';
import { FinancialPeriod } from 'src/app/models/financial-period.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';

@Component({
  selector: 'app-invoice-search-page',
  templateUrl: './invoice-search-page.component.html',
  styleUrls: ['./invoice-search-page.component.scss']
})

export class InvoiceSearchPageComponent implements OnInit {

  displayedColumns: string[] = [
    'invoiceNumber',
    'customer.name',
    'totalAmount',
    'dueAmount',
    'invoiceDate',
    'invoiceDueDate',
    'createdBy.name',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Invoice>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  ribbonopened = true;
  invoiceSearchObj: InvoiceSearchModel;
  financialPeriods: any = [];
  paymentCycles: any = [];
  customerGroups: any = [];
  branches: any = [];
  searchResult: any = [];
  companyId = '';
  index: number | any;
  invoiceId: string = '';
  invoices: any = [];
  invoice: any;
  newInvoiceFee: InvoiceFeeModified | any;
  busy: boolean = false;
  page = 1;
  pageSizeOptions: number[] = [5, 10, 25];
  searchText = '';
  sortOrder = 'asc';
  pages: number | any;
  pageSize = 10;
  subscription: Subscription;
  customerGroup: CustomerGroup | any;
  claims: any;
  searchCustomerBtnDisabled = true;
  public financialPeriodName = new FormControl({ value: '', disabled: true });
  public financialPeriodExists: boolean = false;
  public selectedFinancialPeriod!: FinancialPeriod;
  public paymentCycleName = new FormControl({ value: '', disabled: true });
  public paymentCycleExists: boolean = false;
  public selectedPaymentCycle!: PaymentCycle;

  form = new FormGroup({
    'invoiceNumber': new FormControl(''),
    'receipt': new FormControl(''),
    'payment': new FormControl(''),
    'customer': new FormControl(''),
    'fromDate': new FormControl(''),
    'toDate': new FormControl(''),
    'customerGroupId': new FormControl({ value: '', disabled: true }),
    'branchId': new FormControl({ value: '', disabled: true }),
  });

  constructor(
    private _location: Location,
    private financialPeridService: FinancialPeriodService,
    private paymentCycleService: PaymentCycleService,
    private branchService: BranchService,
    private invoiceService: InvoiceService,
    private storageService: StorageService,
    private messageService: MessageService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    public dialog: MatDialog,
    private authService: AuthService,
  ) {
    this.invoiceSearchObj = new InvoiceSearchModel();
    this.initForm();

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.customerGroupSearchSender) {
          this.customerGroup = message.data;
          this.form.get('customerGroupId')!.setValue(this.customerGroup.id);
        }
      });
  }

  initForm() {
    this.invoiceSearchObj.invoiceNumber = '';
    this.invoiceSearchObj.customer = '';
    this.invoiceSearchObj.fromDate = '';
    this.invoiceSearchObj.toDate = '';
    this.invoiceSearchObj.financialPeriodId = '';
    this.invoiceSearchObj.paymentCycleId = '';
    this.invoiceSearchObj.customerGroupId = '';
    this.invoiceSearchObj.branchId = '';
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.customerGroups = [];
    this.branches = [];
    this.customerGroup = new CustomerGroup();
    this.busy = true;

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

    if (this.claims && this.claims.doceipt_claim_customergroup_access) {
      this.form.get('customerGroupId')!.enable();
      this.searchCustomerBtnDisabled = false;
    }

    if (this.claims && this.claims.doceipt_claim_financialperiod_access) {
      this.financialPeriodName!.enable();
      this.searchFinancialPeriod(" ").then((result: SearchResult) => {
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

    if (this.claims && this.claims.doceipt_claim_branch_access) {
      this.form.get('branchId')!.enable();
      this.searchBranch();
    } else {
      this.busy = false;
    }
  }

  public searchFinancialPeriod(value: string): Promise<any> {
    return this.financialPeridService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public searchPaymentCycle(value: string): Promise<any> {
    return this.paymentCycleService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(CustomerGroupSearchComponent, {
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

  public searchBranch() {
    this.busy = true;
    this.branchService.getAll(this.companyId, this.page, this.pageSize)
      .then((result) => {
        this.branches = result;
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

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public searchInvoice(companyId: string, model: InvoiceSearchModel): Promise<any> {
    return this.invoiceService.searchInvoice(companyId, model, this.page, this.pageSize, 'asc').toPromise();
  }

  search() {
    this.busy = true;
    const model = this.form.value as InvoiceSearchModel;
    this.financialPeriodExists ? model.financialPeriodId = this.selectedFinancialPeriod.id : model.financialPeriodId = "";
    this.paymentCycleExists ? model.paymentCycleId = this.selectedPaymentCycle.id : model.paymentCycleId = "";

    this.searchInvoice(this.companyId, model).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<Invoice>(result.data);
      this.rePaginate(result.rows, result.page - 1);
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

  pageEvent(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.search();
  }

  openDialog(invoice: Invoice): void {
    const serviceFees = [];
    for (let i = 0; i < invoice.invoiceFees.length; i++) {
      this.newInvoiceFee = new InvoiceFeeModified(invoice.invoiceFees[i]);
      serviceFees.push(this.newInvoiceFee);
    }
    const broadCastMesage = this.invoiceService.invoicePreview(serviceFees, invoice);
    const dialogRef = this.dialog.open(IndexInvoicePreviewComponent, {
      width: '1000px',
      data: { show: true, message: broadCastMesage },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      // dialog closed
    });
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

  getDeleteOrVoidDialog(element: Invoice, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the  invoice<br>
        <b>${element.invoiceNumber}</b> of f.period <b>${element.financialPeriod.name}</b> for <b>${element.customer.name}</b>?`,
        input: element.id
      },
    });
  }

  void(id: string): Promise<any> {
    return this.invoiceService.void(id).toPromise();
  }

  openVoidDialog(element: Invoice) {
    if (element.voided) {
      return;
    }
    const dialogRef = this.getDeleteOrVoidDialog(element, 'void');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busy = true;
        this.void(result)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            this.search();
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

  delete(id: string): Promise<any> {
    return this.invoiceService.delete(id).toPromise();
  }

  openDeleteDialog(element: Invoice) {
    const dialogRef = this.getDeleteOrVoidDialog(element, 'delete');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.delete(result)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            const filtered = data.filter(e => e.id !== result);
            this.dataSource.data = filtered;
            this.paginator.length = filtered.length;
            this.rePaginate(filtered.length, this.paginator.pageIndex);
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

  changeRibbonState() {
    if (this.ribbonopened === true) {
      this.ribbonopened = false;
    } else {
      this.ribbonopened = true;
    }
  }

  return() {
    this._location.back();
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

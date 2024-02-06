import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceFeeModified } from 'src/app/models/invoice-fee-modified.model';

import { InvoiceService } from '../invoice.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ConsoleService } from 'src/app/providers/console.service';
import { ToastService } from 'src/app/providers/toast.service';
import { AuthService } from 'src/app/core/authentication/auth.service';

declare var $: any;
import * as _ from 'lodash';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { InvoiceSearch } from 'src/app/interfaces/invoice-search';
import { SearchResult } from 'src/app/interfaces/search-result';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { IndexInvoicePreviewComponent } from '../index-invoice-preview/index-invoice-preview.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

  displayedColumns: string[] = [
    'invoiceNumber',
    'customer.name',
    'currency',
    'totalAmount',
    'dueAmount',
    'invoiceDate',
    'invoiceDueDate',
    'createdBy.name',
    'actions'
  ];

  dataSource = new MatTableDataSource<Invoice>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  companyId = '';
  searchedInvoices: any;
  subscription: Subscription | any;
  invoiceId: string = '';
  invoices: any = [];
  invoice: any;
  selectedIndex: number | any;
  index: number | any;
  newInvoiceFee: InvoiceFeeModified | any;
  groupedInvoice: any;
  claims: any;
  busy: boolean = false;
  page = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private invoiceService: InvoiceService,
    private toastService: ToastService,
    private messageService: MessageService,
    private authService: AuthService,
    private route: Router,
    private consoleService: ConsoleService,
  ) {

  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.dataSource.paginator = this.paginator;
    this.initialize();
  }

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  initialize(): void {
    this.claims = this.authService.userClaims;
    this.searchInvoices();
  }

  public search(model: InvoiceSearch): Promise<any> {
    return this.invoiceService.searchInvoice(this.companyId, model, this.page, this.pageSize, 'desc')
      .toPromise();
  }

  public searchInvoices(): void {
    this.busy = true;
    const model = <InvoiceSearch>{};
    this.search(model).then((result: SearchResult) => {
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
    // this.initialize();
    this.searchInvoices();
  }

  openDialog(invoice: Invoice): void {
    this.consoleService.consoleMessage(invoice);
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
            this.searchInvoices();
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

  goAddInvoice() {
    this.route.navigate(['protected/invoice/add']);
  }

  goSearchInvoice() {
    this.route.navigate(['protected/invoice/search']);
  }
}

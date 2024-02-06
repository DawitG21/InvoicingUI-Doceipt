import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { InvoiceService } from '../../invoice/invoice.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { InvoiceSearchModel } from 'src/app/models/invoice-search.model';
import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceFeeModified } from 'src/app/models/invoice-fee-modified.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import * as _ from 'lodash';

import { IndexInvoicePreviewComponent } from '../../invoice/index-invoice-preview/index-invoice-preview.component';

import { InvoiceSearch } from 'src/app/interfaces/invoice-search';
import { SearchResult } from 'src/app/interfaces/search-result';

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
    'actions'
  ];

  dataSource = new MatTableDataSource<Invoice>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  companyId: string = '';
  page = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25];
  busy: boolean = false;
  invoiceSearchObj: InvoiceSearchModel | any;
  invoices: any = [];
  searchedInvoices: any;
  newInvoiceFee: InvoiceFeeModified | any;
  public claims: any;

  constructor(
    public route: Router,
    public dialog: MatDialog,
    private invoiceService: InvoiceService,
    private storageService: StorageService,
    private toastService: ToastService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {
    this.reset();
  }

  ngOnInit() {
    this.initialize();
    this.dataSource.paginator = this.paginator;
  }

  addPayment() {
    this.route.navigate(['protected/payment/add']);
  }

  reset() {
    this.invoiceSearchObj = new InvoiceSearchModel();
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
    });
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

  pageEvent(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.initialize();
  }

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  initialize(href?: string) {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    const model = <InvoiceSearch>{};
    if (this.claims && this.claims.doceipt_claim_invoice_access) {
      this.loadInvoices(this.companyId, model).then((result: SearchResult) => {
        this.searchedInvoices = result;
        this.invoices = this.searchedInvoices.data;
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
    } else {
      this.busy = false;
    }
  }

  public loadInvoices(companyId: string, model: InvoiceSearch): Promise<any> {
    return this.invoiceService.searchInvoice(companyId, model, this.page, this.pageSize, 'desc')
      .toPromise();
  }
}

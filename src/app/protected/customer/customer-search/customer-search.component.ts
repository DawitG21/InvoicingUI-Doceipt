import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { CustomerService } from '../customer.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { CustomerSearch } from 'src/app/models/customer-search.model';
import { Customer } from 'src/app/models/customer.model';

import { SearchResult } from 'src/app/interfaces/search-result';

import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
declare var $: any;

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss']
})
export class CustomerSearchComponent implements OnInit {

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'searchText': new FormControl(''),
    'customerGroupId': new FormControl(''),
    'branchId': new FormControl(''),
  });
  busy: boolean = false;
  model: CustomerSearch | any;
  customers: any = [];
  companyId: string = '';
  searchText: string = '';
  searchFilter: CustomerSearch;
  page = 1;
  pageSize = 10;
  claims: any;

  pageSizeOptions: number[] = [5, 10, 25];
  pages: number | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CustomerSearchComponent>,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private customerService: CustomerService,
    private messageService: MessageService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
    this.searchFilter = new CustomerSearch();
    this.searchFilter.branchId = '';
    this.searchFilter.customerGroupId = '';
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
  }

  public rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public searchCustomer(companyId: string, searchText: string, model: CustomerSearch): Promise<any> {
    return this.customerService.search(companyId, searchText, model, this.page, this.pageSize, 'asc')
      .toPromise();
  }

  search(): void {
    this.busy = true;
    if (
      this.form.get('searchText')!.value === ''
    ) {
      this.model = <CustomerSearch>{};
      this.searchText = this.form.get('searchText')!.value;
    } else {
      this.model = this.form.value as CustomerSearch;
      this.searchText = this.form.get('searchText')!.value;
    }
    this.searchCustomer(this.companyId, this.searchText, this.model).then((result: SearchResult) => {
      this.customers = result.data;
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

  public pageEvent(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.search();
  }

  select(customer: Customer) {
    if (!customer.isActive) {
      this.openCustomerInactiveDialog(customer);
    } else {
      const message = new BroadcastMessage(this.messageService.customerSearchSender, customer);
      this.broadcastService.broadcastTask(message);
      this.dialogRef.close();
    }

  }

  openCustomerInactiveDialog(customer: Customer) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '450px',
      maxWidth: '620px',
      data: { message: `The customer you selected is not active! Do you wish to proceed?`, input: true },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const message = new BroadcastMessage(this.messageService.customerSearchSender, customer);
        this.broadcastService.broadcastTask(message);
        this.dialogRef.close();
      }
    });
  }

}

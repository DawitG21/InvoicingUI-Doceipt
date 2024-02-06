import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { MessageService } from 'src/app/providers/message.service';
import { CustomerService } from '../customer.service';
import { ToastService } from 'src/app/providers/toast.service';
import { StorageService } from 'src/app/providers/storage.service';

import { CustomerNew } from 'src/app/models/customer-new.model';
import { Customer } from 'src/app/models/customer.model';

import { SearchResult } from 'src/app/interfaces/search-result';

import { CustomerPreviewComponent } from 'src/app/protected/customer/customer-preview/customer-preview.component';
import { ConfirmDialogComponent } from 'src/app/protected/app-dialog/confirm-dialog/confirm-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// import { data } from 'jquery';
import { CustomerSearch } from 'src/app/models/customer-search.model';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'referenceId',
    'branchName',
    'customerGroupName',
    'isActive',
    'actions'
  ];

  dataSource = new MatTableDataSource<Customer>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  companyId: string = '';
  busy: boolean = false;
  page = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  searchText = '';
  claims: any;
  importBtnText: string = 'Import';
  disableImportBtn: boolean = false;
  subscription!: Subscription;
  private customerKey = 'customer';

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    public route: Router,
    private customerService: CustomerService,
    private storageService: StorageService,
    private messageService: MessageService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
  ) {
    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message && message.sender === this.messageService.importingInProgressSender) {
          this.importBtnText = 'Importing...';
          this.disableImportBtn = true;
        } else if (message && message.sender === this.messageService.importCompleted) {
          this.importBtnText = 'Import';
          this.disableImportBtn = false;
        }
      });
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.dataSource.paginator = this.paginator;
    this.search();
  }

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public searchCustomers(model: CustomerSearch): Promise<any> {
    return this.customerService.search(this.companyId, this.searchText, model, this.page, this.pageSize, 'asc')
      .toPromise();
  }

  public initiateImportCustomer() {
    let customerImportInitalizer = new BroadcastMessage(this.messageService.customerImportSender, this.companyId);
    this.broadcastService.broadcastTask(customerImportInitalizer);
  }

  search(href?: string): void {
    this.busy = true;
    const model = <CustomerNew>{};

    this.searchCustomers(model).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<Customer>(result.data);
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

  delete(id: string): Promise<any> {
    return this.customerService.delete(id).toPromise();
  }

  getDeleteOrVoidDialog(element: Customer, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the customer<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: Customer) {
    const dialogRef = this.getDeleteOrVoidDialog(element, 'delete');

    dialogRef.afterClosed().subscribe(result => {
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

  create() {
    this.route.navigate(['protected/customer/add']);
  }

  edit(customer: any) {
    // console.log(customer);
    this.storageService.setData(this.customerKey, customer);
    this.route.navigate(['protected/customer/edit']);
  }

  gotoSearch() {
    this.route.navigate(['protected/customer/search']);
  }

  pageEvent(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.search();
  }

  openCustomerPreviewDialog(customer: Customer): void {
    const dialogRef = this.dialog.open(CustomerPreviewComponent, {
      width: '700px',
      data: { show: true, message: customer },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      // dialog closed
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }
}

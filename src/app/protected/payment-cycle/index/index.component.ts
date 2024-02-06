import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PaymentCycle } from 'src/app/models/payment-cycle.model';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { PaymentCycleService } from '../payment-cycle.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

  displayedColumns: string[] = [
    'orderNo',
    'name',
    'description',
    'isActive',
    'actions'
  ];

  dataSource = new MatTableDataSource<PaymentCycle>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  companyId: string = '';
  busy: boolean = false;
  public claims: any;
  public page = 1;
  public pageSize = 10;
  public searchText = '';
  public sortOrder = 'asc';
  pageSizeOptions: number[] = [5, 10, 25];

  constructor(
    public dialog: MatDialog,
    public route: Router,
    private paymentCycleService: PaymentCycleService,
    private storageService: StorageService,
    private messageService: MessageService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.initialize();
    this.dataSource.paginator = this.paginator;
  }

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  pageEvent(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.search();
  }

  search(href?: string): void {
    this.busy = true;

    this.getAllPaymentCycle(this.companyId).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<PaymentCycle>(result.data);
      this.rePaginate(result.rows, result.page - 1);
      //this.dataSource.paginator = this.paginator;
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

  initialize() {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.search();

  }

  public getAllPaymentCycle(companyId: string): Promise<any> {
    return this.paymentCycleService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder).toPromise();
  }

  deletePaymentCycle(id: string): Promise<any> {
    return this.paymentCycleService.delete(id).toPromise();
  }

  getDeleteDialog(element: PaymentCycle, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the customer group<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: PaymentCycle) {
    const dialogRef = this.getDeleteDialog(element, 'delete');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.deletePaymentCycle(result)
          .then(() => {
            const filtered = data.filter(e => e.id !== result);
            this.dataSource.data = filtered;
            this.paginator.length = filtered.length;
            this.rePaginate(filtered.length, this.paginator.pageIndex);
            this.toastService.success(this.messageService.operationSuccesful);
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

  edit(arg: any) {
    this.storageService.setData('data', arg);
    this.route.navigate(['protected/payment-cycle/edit']);
  }

  addPaymentCycle() {
    this.route.navigate(['protected/payment-cycle/add']);
  }
}

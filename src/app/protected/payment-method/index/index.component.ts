import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { PaymentMethodService } from '../payment-method.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';
import { HelperService } from 'src/app/providers/helper.service';

import { PaymentMethod } from 'src/app/models/payment-method.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  companyId: string = '';
  subscription: Subscription;
  index: number | any;
  busy: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25];
  displayedColumns: string[] = ['orderNo', 'name', 'description', 'status', 'actions'];
  dataSource = new MatTableDataSource<PaymentMethod>();
  public claims: any;
  public page = 1;
  public pageSize = 10;
  public searchText = '';
  public sortOrder = 'asc';

  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  constructor(
    private route: Router,
    private paymentMethodService: PaymentMethodService,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    private storageService: StorageService,
    private toastService: ToastService,
    private helperService: HelperService,
    public dialog: MatDialog,
    private authService: AuthService,
  ) {

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.initialize();
        }
      });
  }

  ngOnInit() {
    this.initialize();
  }

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  initialize() {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.getAllPaymentMethods(this.companyId).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<PaymentMethod>(result.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

  public getAllPaymentMethods(companyId: string): Promise<any> {
    return this.paymentMethodService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder).toPromise();
  }

  delete(id: string): Promise<any> {
    return this.paymentMethodService.delete(id).toPromise();
  }

  getDeleteOrVoidDialog(element: PaymentMethod, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the branch<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: PaymentMethod) {
    const dialogRef = this.getDeleteOrVoidDialog(element, 'delete');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;

        this.delete(result).then(() => {
          this.toastService.success(this.messageService.operationSuccesful);
          const filtered = data.filter(e => e.id !== result);
          this.dataSource.data = filtered;
          this.paginator.length = filtered.length;
          this.rePaginate(filtered.length, this.paginator.pageIndex);
        }, _reject => {
          this.toastService.error(_reject);
        })
          .catch(error => {
            this.toastService.error(error);
          })
          .finally(() => {
            this.busy = false;
          });
      }
    });
  }

  edit(arg: any, index: number) {
    this.index = index;
    this.storageService.setData('data', arg);
    this.route.navigate(['protected/payment-method/edit']);
  }

  addPaymentMethod() {
    this.route.navigate(['protected/payment-method/add']);
  }

  getActiveColor(isActive: boolean): string {
    return this.helperService.getActiveColor(isActive);
  }

}

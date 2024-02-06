import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { PaymentPolicyService } from '../payment-policy.service';

import { PaymentPolicy } from 'src/app/models/payment-policy.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'description',
    'minPercent',
    'isActive',
    'autoDiscount',
    'actions'
  ];

  dataSource = new MatTableDataSource<PaymentPolicy>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  companyId: string = '';
  pageSize = 10;
  busy: boolean = false;
  public claims: any;

  constructor(
    public dialog: MatDialog,
    public route: Router,
    private paymentPolicyService: PaymentPolicyService,
    private storageService: StorageService,
    private messageService: MessageService,
    private toastService: ToastService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.initialize();
    this.dataSource.paginator = this.paginator;
  }

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  initialize(reload?: boolean) {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;

    this.getAll(this.companyId).then((result) => {
      this.dataSource = new MatTableDataSource<PaymentPolicy>(result);
      this.dataSource.paginator = this.paginator;
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

  public getAll(companyId: string): Promise<any> {
    return this.paymentPolicyService.getAll(companyId).toPromise();
  }

  addPaymentPolicy() {
    this.route.navigate(['/protected/payment-policy/add']);
  }

  deletePaymentPolicy(id: string): Promise<any> {
    return this.paymentPolicyService.delete(id).toPromise();
  }

  getDeleteDialog(element: PaymentPolicy, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the payment policy<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: PaymentPolicy) {
    const dialogRef = this.getDeleteDialog(element, 'delete');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.deletePaymentPolicy(result)
          .then(() => {
            const filtered = data.filter(e => e.id !== result);
            this.dataSource.data = filtered;
            this.paginator.length = filtered.length;
            this.rePaginate(filtered.length, this.paginator.pageIndex);
            this.busy = false;
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
    this.route.navigate(['protected/payment-policy/edit']);
  }

}

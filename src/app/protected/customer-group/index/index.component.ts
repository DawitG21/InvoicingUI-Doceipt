import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { CustomerGroupService } from '../customer-group.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { CustomerGroup } from 'src/app/models/customer-group.model';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { CustomerGroupSearchComponent } from '../customer-group-search/customer-group-search.component';
import { ImportDialogComponent } from '../../app-dialog/import-dialog/import-dialog.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

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

  dataSource = new MatTableDataSource<CustomerGroup>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  companyId: string = '';
  pageSize = 10;
  busy: boolean = false;
  page = 1;
  pageSizeOptions: number[] = [5, 10, 25];
  searchText = '';
  public claims: any;

  constructor(
    public dialog: MatDialog,
    public route: Router,
    private customerGroupService: CustomerGroupService,
    private storageService: StorageService,
    private messageService: MessageService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
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

  public searchCustomerGroup(companyId: string): Promise<any> {
    return this.customerGroupService.search(companyId, this.searchText, this.page, this.pageSize, 'asc', false)
      .toPromise();
  }

  search(): void {
    this.busy = true;

    this.searchCustomerGroup(this.companyId).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<CustomerGroup>(result.data);
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

  deleteCustomerGroup(id: string): Promise<any> {
    return this.customerGroupService.delete(id).toPromise();
  }

  getDeleteDialog(element: CustomerGroup, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the customer group<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openImportDialog() {
    const dialogRef = this.getImportDialog();
  }

  getImportDialog() {
    return this.dialog.open(ImportDialogComponent, {
      width: '550px',
      data: {
        message: this.messageService.customerGroupImportSender
      }
    });
  }

  openDeleteDialog(element: CustomerGroup) {
    const dialogRef = this.getDeleteDialog(element, 'delete');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.deleteCustomerGroup(result)
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

  edit(arg: any) {
    this.storageService.setData('data', arg);
    this.route.navigate(['protected/customer-group/edit']);
  }

  addCustomerGroup() {
    this.route.navigate(['/protected/customer-group/add']);
  }

  openDialog(): void {
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
}



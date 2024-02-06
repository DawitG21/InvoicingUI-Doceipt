import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { FinancialPeriodService } from '../financial-period.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { FinancialPeriod } from 'src/app/models/financial-period.model';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

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
    'name',
    'description',
    'startDate',
    'endDate',
    'opened',
    'actions'
  ];

  dataSource = new MatTableDataSource<FinancialPeriod>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  companyId: string = '';
  busy: boolean = false;
  public claims: any;
  public page = 1;
  public pageSize = 10;
  public searchText = '';
  public sortOrder = 'asc';

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private financialPeriodService: FinancialPeriodService,
    private messageService: MessageService,
    private storageService: StorageService,
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

    this.getAllFinancialPeriods();
  }

  public getAll(companyId: string): Promise<any> {
    return this.financialPeriodService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder).toPromise();
  }

  public getAllFinancialPeriods(): void {
    this.busy = true;
    this.getAll(this.companyId).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<FinancialPeriod>(result.data);
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

  delete(id: string): Promise<any> {
    return this.financialPeriodService.delete(id).toPromise();
  }

  getDeleteOrVoidDialog(element: FinancialPeriod, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the financial period<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: FinancialPeriod) {
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

  openVoidDialog(element: FinancialPeriod) {
    if (element.voided) {
      return;
    }

    const dialogRef = this.getDeleteOrVoidDialog(element, 'void');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.delete(result)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            this.initialize(true);
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
    this.router.navigate(['protected/financial-period/edit']);
  }

  addFinancialYear() {
    this.router.navigate(['protected/financial-period/add']);
  }

}

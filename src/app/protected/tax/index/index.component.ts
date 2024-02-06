import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { TaxService } from '../tax.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { Tax } from 'src/app/models/tax.model';

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
    'percentValue',
    'isActive',
    'actions'
  ];

  dataSource = new MatTableDataSource<Tax>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  busy: boolean = false;
  companyId: string = '';
  public claims: any;
  public page = 1;
  public pageSize = 10;
  public searchText = '';
  public sortOrder = 'asc';

  constructor(
    public dialog: MatDialog,
    public route: Router,
    private taxService: TaxService,
    private messageService: MessageService,
    private storageService: StorageService,
    private toastService: ToastService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.initialize();
  }

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public getAllTaxes(companyId: string): Promise<any> {
    return this.taxService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder).toPromise();
  }

  initialize(reload?: boolean) {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;

    this.getAllTaxes(this.companyId).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<Tax>(result.data);
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
    return this.taxService.delete(id).toPromise();
  }

  getDeleteDialog(element: Tax, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the tax<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: Tax) {
    const dialogRef = this.getDeleteDialog(element, 'delete');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.delete(result)
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
    this.route.navigate(['protected/tax/edit']);
  }

  addTax() {
    this.route.navigate(['protected/tax/add']);
  }

}

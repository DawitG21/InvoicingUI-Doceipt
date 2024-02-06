import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { ToastService } from 'src/app/providers/toast.service';
import { ServiceService } from '../service.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { HelperService } from 'src/app/providers/helper.service';

import { Service } from 'src/app/models/service.model';

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

  index: number | any;
  companyId: string = '';
  busy: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25];
  public claims: any;
  public page = 1;
  public pageSize = 10;
  public searchText = '';
  public sortOrder = 'asc';

  displayedColumns: string[] = ['order', 'name', 'description', 'mandatory', 'status', 'actions'];
  dataSource = new MatTableDataSource<Service>();

  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  constructor(
    public route: Router,
    private serviceService: ServiceService,
    private storageService: StorageService,
    private messageService: MessageService,
    private helperService: HelperService,
    private toastService: ToastService,
    public dialog: MatDialog,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.initialize();
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

  initialize(_reload?: boolean) {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.search();

  }

  public getAll(companyId: string): Promise<any> {
    return this.serviceService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder).toPromise();
  }

  search(href?: string): void {
    this.busy = true;

    this.getAll(this.companyId).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<Service>(result.data);
      this.rePaginate(result.rows, result.page - 1);
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

  add() {
    this.route.navigate(['protected/service/add']);
  }

  edit(arg: any, index: number) {
    this.index = index;
    this.storageService.setData('data', arg);
    this.route.navigate(['protected/service/edit']);
  }

  delete(id: string): Promise<any> {
    return this.serviceService.delete(id).toPromise();
  }

  getDeleteOrVoidDialog(element: Service, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the service<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: Service) {
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

  getAciveColor(isActive: boolean): string {
    return this.helperService.getActiveColor(isActive);
  }
}

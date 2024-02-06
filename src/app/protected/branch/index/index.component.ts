import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BranchService } from '../branch.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Branch } from 'src/app/models/branch.model';
import { BranchEdit } from 'src/app/models/branch-edit.model';

import { SearchResult } from 'src/app/interfaces/search-result';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { BranchPreviewComponent } from '../../branch/branch-preview/branch-preview.component';
import { ImportDialogComponent } from '../../app-dialog/import-dialog/import-dialog.component';

declare var $: any;

@Component({
  selector: 'app-index',
  styleUrls: ['./index.component.scss'],
  templateUrl: './index.component.html',
})

export class IndexComponent implements OnInit {

  public companyId: string = '';
  public subscription: Subscription;
  public busy: boolean = false;
  public pageSize = 10;
  public page = 1;
  public pageSizeOptions: number[] = [5, 10, 25];
  public searchText = '';
  public claims: any;

  public displayedColumns: string[] = ['name', 'email', 'city', 'state', 'status', 'actions'];
  public dataSource = new MatTableDataSource<Branch>();

  @ViewChild(MatSort, { static: true }) public sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator | any;

  constructor(
    public router: Router,
    private branchService: BranchService,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    private storageService: StorageService,
    private toastService: ToastService,
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

  public ngOnInit() {
    this.initialize();
  }

  public rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public initialize() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.search();
  }

  public searchBranches(): Promise<any> {
    return this.branchService.search(this.companyId, this.searchText, this.page, this.pageSize, 'asc', false)
      .toPromise();
  }

  public search(): void {
    this.busy = true;
    this.searchBranches().then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<Branch>(result.data);
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

  public delete(id: string): Promise<any> {
    return this.branchService.delete(id).toPromise();
  }

  public getDeleteDialog(element: Branch, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: element.id,
        message: `Are you sure you want to ${action} the branch<br>
        <b>${element.name}</b>?`,
      },
      width: '450px',
    });
  }

  public openDeleteDialog(element: Branch) {
    const dialogRef = this.getDeleteDialog(element, 'delete');

    dialogRef.afterClosed().subscribe((result) => {
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

  public openDialog(element: BranchEdit): void {
    const dialogRef = this.dialog.open(BranchPreviewComponent, {
      data: { show: true, message: element },
      disableClose: true,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // branch preview dialog closed'
    });

    dialogRef.backdropClick().subscribe(() => {
      // allow closing the dialog on backdrop click
      dialogRef.close();
    });
  }

  public edit(arg: any) {
    this.storageService.setData('data', arg);
    this.router.navigate(['protected/branch/edit']);
  }

  public addBranch() {
    this.router.navigate(['protected/branch/add']);
  }

  public pageEvent(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.search();
  }

  public openImportDialog() {
    const dialogRef = this.getImportDialog();
  }

  public getImportDialog() {
    return this.dialog.open(ImportDialogComponent, {
      data: {
        message: this.messageService.branchImportSender,
      },
      width: '550px',
    });
  }

}

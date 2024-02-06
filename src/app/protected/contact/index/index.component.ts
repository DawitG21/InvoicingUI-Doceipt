import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { ContactService } from '../contact.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Contact } from 'src/app/models/contact.model';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { ContactPreviewComponent } from '../contact-preview/contact-preview.component';
import { ImportDialogComponent } from '../../app-dialog/import-dialog/import-dialog.component';

import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-index',
  styleUrls: ['./index.component.scss'],
  templateUrl: './index.component.html',
})

export class IndexComponent implements OnInit {

  public displayedColumns: string[] = [
    'name',
    'gender',
    'phonenumber',
    'status',
    'actions',
  ];

  public dataSource = new MatTableDataSource<Contact>();
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator | any;

  public claims: any;
  public busy: boolean = false;
  public searchText = '';
  public page = 1;
  public pageSize = 10;
  public pageSizeOptions: number[] = [5, 10, 25];
  public companyId: string = '';
  public subscription: Subscription;
  public importTaskRunning: boolean = false;
  public importResult: SearchResult | any;

  constructor(
    private authService: AuthService,
    public route: Router,
    private contactService: ContactService,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private toastService: ToastService,
    public dialog: MatDialog,
  ) {
    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.search();
        }

        // listen for background import page
        if (message.sender === this.messageService.contactImportSender) {
          this.importResult = message.data;
        }
      });
  }

  public ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.dataSource.paginator = this.paginator;
    this.search();
  }

  public rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public searchContacts(companyId: string): Promise<any> {
    return this.contactService.search(companyId, this.searchText, this.page, this.pageSize, 'desc', false).toPromise();
  }

  public search(): void {
    this.busy = true;
    this.searchContacts(this.companyId).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<Contact>(result.data);
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

  public delete(id: string): Promise<any> {
    return this.contactService.delete(id).toPromise();
  }

  public getDeleteOrVoidDialog(element: Contact, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: element.id,
        message: `Are you sure you want to ${action} the contact<br>
        <b>${element.name}</b>?`,
      },
      width: '450px',
    });
  }

  public openDeleteDialog(element: Contact) {
    const dialogRef = this.getDeleteOrVoidDialog(element, 'delete');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.delete(result)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            const filtered = data.filter((e) => e.id !== result);
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

  public openDialog(element: Contact): void {
    const dialogRef = this.dialog.open(ContactPreviewComponent, {
      data: { show: true, message: element },
      disableClose: true,
      width: '550px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      // branch preview dialog closed
    });
    dialogRef.backdropClick().subscribe(() => {
      // allow closing the dialog on backdrop click
      dialogRef.close();
    });
  }

  public edit(contact: any) {
    this.storageService.setData('data', contact);
    this.route.navigate(['protected/contact/edit']);
  }

  public create() {
    this.route.navigate(['protected/contact/add']);
  }

  public goSearch() {
    this.route.navigate(['protected/contact/search']);
  }

  public openImportDialog() {

    const dialogRef = this.getImportDialog();

    // check state of dialog
    dialogRef.afterClosed().subscribe((result) => {

      // if background task running
      if (result === 'background') {
        // TODO: show animation on bottom of page or notch
        this.importTaskRunning = true;
      }
    });
  }

  public getImportDialog() {
    return this.dialog.open(ImportDialogComponent, {
      data: {
        input: this.importTaskRunning,
        message: this.messageService.contactImportSender,
      },
      width: '550px',
    });
  }

}

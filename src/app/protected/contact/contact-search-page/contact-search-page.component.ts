import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SearchResult } from 'src/app/interfaces/search-result';

import { Contact } from 'src/app/models/contact.model';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { ContactService } from '../contact.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { ContactPreviewComponent } from '../contact-preview/contact-preview.component';

@Component({
  selector: 'app-contact-search-page',
  styleUrls: ['./contact-search-page.component.scss'],
  templateUrl: './contact-search-page.component.html',
})
export class ContactSearchPageComponent implements OnInit {

  public form = new FormGroup({
    companyId: new FormControl('', [Validators.required]),
    searchText: new FormControl(''),
  });

  public displayedColumns: string[] = [
    'name',
    'gender',
    'email',
    'phonenumber',
    'status',
    'actions',
  ];

  public dataSource = new MatTableDataSource<Contact>();
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator | any;

  public ribbonopened = true;
  public claims: any;
  public busy: boolean = false;
  public page = 1;
  public pageSize = 10;
  public pageSizeOptions: number[] = [5, 10, 25];
  public companyId: string ='';

  constructor(
    private location: Location,
    private authService: AuthService,
    public route: Router,
    private contactService: ContactService,
    private storageService: StorageService,
    private messageService: MessageService,
    private toastService: ToastService,
    public dialog: MatDialog,
  ) {
  }

  public ngOnInit(): void {
    this.companyId = this.storageService.getCompanyId;
    this.form.get('companyId')!.setValue(this.companyId);
    this.claims = this.authService.userClaims;
    this.dataSource.paginator = this.paginator;
  }

  public changeRibbonState() {
    if (this.ribbonopened === true) {
      this.ribbonopened = false;
    } else {
      this.ribbonopened = true;
    }
  }

  public goBack() {
    this.location.back();
  }

  public rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public searchContact(companyId: string, searchText: string): Promise<any> {
    return this.contactService.search(companyId, searchText, this.page, this.pageSize, 'desc', false).toPromise();
  }

  public search(href?: string): void {
    this.busy = true;
    const searchTxt = this.form.get('searchText')!.value;
    this.searchContact(this.companyId, searchTxt).then((result: SearchResult) => {
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

  public openDialog(element: Contact): void {
    const dialogRef = this.dialog.open(ContactPreviewComponent, {
      data: { show: true, message: element },
      disableClose: true,
      width: '550px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      // contact preview dialog closed
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

}

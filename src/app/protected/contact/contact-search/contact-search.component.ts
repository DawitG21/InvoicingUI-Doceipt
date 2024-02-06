import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BroadcastService } from 'src/app/providers/broadcast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ContactService } from '../contact.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Contact } from 'src/app/models/contact.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { SearchResult } from 'src/app/interfaces/search-result';

declare var $: any;

@Component({
  selector: 'app-contact-search',
  templateUrl: './contact-search.component.html',
  styleUrls: ['./contact-search.component.scss']
})
export class ContactSearchComponent implements OnInit {

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'searchText': new FormControl('')
  });

  busy: boolean = false;
  contacts: any = [];
  companyId: string = '';
  searchText: string = '';
  message: string = '';
  page = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25];
  pages: number | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ContactSearchComponent>,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private contactService: ContactService,
    private messageService: MessageService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
  }

  public rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  searchContact(companyId: string): Promise<any> {
    return this.contactService.search(companyId, this.searchText, this.page, this.pageSize, 'asc', false).toPromise();
  }

  public search(): void {
    this.busy = true;
    if (
      this.form.get('searchText')!.value === ''
    ) {
      this.searchText = this.form.get('searchText')!.value;
    } else {
      this.searchText = this.form.get('searchText')!.value;
    }

    this.searchContact(this.companyId).then((result: SearchResult) => {
      this.contacts = result.data;
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

  select(contact: Contact) {
    const message = new BroadcastMessage(this.messageService.contactSearchSender, contact);
    this.broadcastService.broadcastTask(message);
    this.dialogRef.close();
  }

}

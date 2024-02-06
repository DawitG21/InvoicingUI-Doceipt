import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { CustomerGroupService } from '../customer-group.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { SearchResult } from 'src/app/interfaces/search-result';

import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { CustomerGroup } from 'src/app/models/customer-group.model';

declare var $: any;

@Component({
  selector: 'app-customer-group-search',
  templateUrl: './customer-group-search.component.html',
  styleUrls: ['./customer-group-search.component.scss']
})
export class CustomerGroupSearchComponent implements OnInit {

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'searchText': new FormControl('')
  });
  busy: boolean = false;
  companyId: string = '';
  searchText = '';
  page = 1;
  pageSize = 10;
  searchResult: any = [];
  pageSizeOptions: number[] = [5, 10, 25];
  pages: number | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CustomerGroupSearchComponent>,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private customerGroupService: CustomerGroupService,
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

  public searchCustomerGroup(companyId: string, searchText: string): Promise<any> {
    return this.customerGroupService.search(companyId, searchText, this.page, this.pageSize, 'asc', false)
      .toPromise();
  }

  search(): void {
    this.busy = true;
    this.searchText = this.form.get('searchText')!.value;
    this.searchCustomerGroup(this.companyId, this.searchText).then((result: SearchResult) => {
      this.searchResult = result.data;
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

  select(customerGroup: CustomerGroup) {
    const message = new BroadcastMessage(this.messageService.customerGroupSearchSender, customerGroup);
    this.broadcastService.broadcastTask(message);
    this.dialogRef.close();
  }

}

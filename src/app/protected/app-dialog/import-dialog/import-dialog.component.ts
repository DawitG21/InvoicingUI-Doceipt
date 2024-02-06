import { Component, OnInit, Inject, OnDestroy } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { CustomerSearch } from 'src/app/models/customer-search.model';

import { SearchResult } from 'src/app/interfaces/search-result';
import { DialogConfirmData } from 'src/app/interfaces/dialog-confirm-data';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { CustomerGroupService } from '../../customer-group/customer-group.service';
import { BranchService } from '../../branch/branch.service';
import { CustomerService } from '../../customer/customer.service';
import { ContactService } from '../../contact/contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit, OnDestroy {

  message: string = '';
  companyId: string = '';
  page = 1;
  searchText = '';
  pageSize = 1;
  progress: number | undefined;
  customerModel: CustomerSearch = new CustomerSearch;
  completed: boolean = false;
  taskRunning: boolean = false;
  httpSubscription: Subscription | undefined;
  searchResult: SearchResult | undefined;

  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private messageService: MessageService,
    private customerGroupService: CustomerGroupService,
    private branchService: BranchService,
    private customerService: CustomerService,
    private contactService: ContactService,
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData
  ) { }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.completed = false;
    this.message = 'Initalizing...';
    this.customerModel = <CustomerSearch>{};

    if (this.data.message === this.messageService.customerGroupImportSender) {
      this.importHelper(this.importCustomerGroup);
    } else if (this.data.message === this.messageService.branchImportSender) {
      this.importHelper(this.importBranch);
    // } else if (this.data.message === this.messageService.customerImportSender) {
    //   this.importHelper(this.importCustomer);
    } else if (this.data.message === this.messageService.contactImportSender) {
      this.importHelper(this.importContact);
    }
  }


  ngOnDestroy() {
    if (this.httpSubscription && !this.httpSubscription.closed) {
      this.httpSubscription.unsubscribe();
    }
  }


  onDialogClick(dialogResult: string): void {
    if (dialogResult === 'done') {
      this.dialogRef.close('done');
    } else {
      this.openCancelDialog();
    }
  }

  getCancelImportDialog() {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to cancel importing <br>`,
        input: 'cancel'
      },
    });
  }

  openCancelDialog() {
    const dialogRef = this.getCancelImportDialog();

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'cancel') {
        this.onDialogClick('done');
      }
    });
  }

  async importHelper(fnc: any): Promise<void> {
    // initialize paging values
    this.page = 0;
    this.pageSize = 100;
    this.progress = 0;
    this.taskRunning = true;

    this.updateImportMessage();

    while (this.taskRunning) {
      await fnc().then(
        (result: any) => {
          this.updateImportMessage();
        },
        (error: any) => {
          this.updateImportMessage();
          this.taskRunning = false;
        }
      );
    }
  }

  importCustomerGroup = (href?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.httpSubscription = this.customerGroupService.search(this.companyId, this.searchText, this.page, this.pageSize, 'asc', true, href)
        .subscribe((result: SearchResult) => {
          
          this.updateProgress(result);
          
          if (!result.data || result.data.length === 0) {
            reject();
          } else {
            resolve();
          }
        }, (error) => { reject();});
    });
  }

  importBranch = (href?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.httpSubscription = this.branchService.search(this.companyId, this.searchText, this.page, this.pageSize, 'asc', true, href)
        .subscribe((result: SearchResult) => {
          
          this.updateProgress(result);
          
          if (!result.data || result.data.length === 0) {
            reject();
          } else {
            resolve();
          }
        }, (error) => { reject();});
    });
  }

  // importCustomer = (href?: string): Promise<void> => {
  //   return new Promise((resolve, reject) => {
  //     this.httpSubscription = this.customerService.search(this.companyId, this.searchText, this.customerModel, this.page, this.pageSize, 'asc', true, href)
  //       .subscribe((result: SearchResult) => {
          
  //         this.updateProgress(result);
          
  //         if (!result.data || result.data.length === 0) {
  //           reject();
  //         } else {
  //           resolve();
  //         }
  //       }, (error) => { reject();});
  //   });
  // }

  importContact = (href?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.httpSubscription = this.contactService.search(this.companyId, this.searchText, this.page, this.pageSize, 'asc', true, href)
        .subscribe((result: SearchResult) => {
          
          this.updateProgress(result);
          
          if (!result.data || result.data.length === 0) {
            reject();
          } else {
            resolve();
          }
        }, (error) => { reject();});
    });
  }

  private updateProgress(result: SearchResult): void {
    this.page = result.page;
    this.searchResult = result;
    let progress = this.searchResult.page * 100 / this.searchResult.pages;
    this.progress = parseFloat(progress.toFixed(2));
  }

  private updateImportMessage(): void {
    if (this.page === 1 && (!this.searchResult || this.searchResult.data.length === 0)) {
      this.message = 'No data imported';
      return;

    } else if (this.searchResult && (this.searchResult.data.length === 0 || this.searchResult.page === this.searchResult.pages)) {
      this.message = 'Import completed';
      this.completed = true;
      return;
    }

    this.message = `Importing page ${++this.page} (${this.progress}%)...`;
  }

}

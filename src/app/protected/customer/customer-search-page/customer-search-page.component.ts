import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { CustomerService } from '../customer.service';
import { StorageService } from 'src/app/providers/storage.service';
import { BranchService } from '../../branch/branch.service';
import { MessageService } from 'src/app/providers/message.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { ToastService } from 'src/app/providers/toast.service';

import { Customer } from 'src/app/models/customer.model';
import { CustomerSearch } from 'src/app/models/customer-search.model';
import { CustomerGroup } from 'src/app/models/customer-group.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { SearchResult } from 'src/app/interfaces/search-result';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { CustomerPreviewComponent } from 'src/app/protected/customer/customer-preview/customer-preview.component';
import { CustomerGroupSearchComponent } from '../../customer-group/customer-group-search/customer-group-search.component';

@Component({
  selector: 'app-customer-search-page',
  templateUrl: './customer-search-page.component.html',
  styleUrls: ['./customer-search-page.component.scss']
})

export class CustomerSearchPageComponent implements OnInit {

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'searchText': new FormControl(''),
    'referenceId': new FormControl(''),
    'customerGroupId': new FormControl(''),
    'branchId': new FormControl({ value: '', disabled: true }),
  });

  displayedColumns: string[] = [
    'name',
    'referenceId',
    'branch.name',
    'customerGroup.name',
    'isActive',
    'actions'
  ];

  dataSource = new MatTableDataSource<Customer>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  companyId: string = '';
  busy: boolean = false;
  model: CustomerSearch | any;
  page = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25];
  ribbonopened = true;
  customers: any = [];
  searchResult: any = [];
  searchText = '';
  searchFilter: CustomerSearch;
  customerGroups: any = [];
  branches: any = [];
  subscription: Subscription;
  customerGroup: CustomerGroup | any;
  pages: number | any;
  claims: any;
  public customerGroupDisabled = true;

  constructor(
    public dialog: MatDialog,
    public route: Router,
    private customerService: CustomerService,
    private storageService: StorageService,
    private _location: Location,
    private branchService: BranchService,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
    this.searchFilter = new CustomerSearch();
    this.searchFilter.branchId = '';
    this.searchFilter.customerGroupId = '';

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.customerGroupSearchSender) {
          this.customerGroup = message.data;
          this.form.get('customerGroupId')!.setValue(this.customerGroup.id);
        }
      });
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.dataSource.paginator = this.paginator;
    if (this.claims && this.claims.doceipt_claim_branch_access) {
      this.form.get('branchId')!.enable();
      this.searchBranch();
    }
    if (this.claims && this.claims.doceipt_claim_branch_access) {
      this.customerGroupDisabled = false;
    }
    this.initialize();
  }

  public searchBranch() {
    this.busy = true;
    this.branchService.getAll(this.companyId, this.page, this.pageSize)
      .then((result) => {
        this.branches = result;
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

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public searchCustomer(companyId: string, searchText: string, model: CustomerSearch): Promise<any> {
    return this.customerService.search(companyId, searchText, model, this.page, this.pageSize, 'asc')
      .toPromise();
  }

  search(href?: string): void {
    this.busy = true;
    this.model = this.form.value as CustomerSearch;
    this.searchText = this.form.get('searchText')!.value;

    this.searchCustomer(this.companyId, this.searchText, this.model).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<Customer>(result.data);
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

  initialize(reload?: boolean) {
    this.customerGroup = new CustomerGroup();
  }

  delete(id: string): Promise<any> {
    return this.customerService.delete(id).toPromise();
  }

  getDeleteOrVoidDialog(element: Customer, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the customer<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: Customer) {
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

  edit(customer: any) {
    this.storageService.setData('data', customer);
    this.route.navigate(['protected/customer/edit']);
  }

  pageEvent(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.search();
  }

  openDialog(customer: Customer): void {
    const dialogRef = this.dialog.open(CustomerPreviewComponent, {
      width: '650px',
      data: { show: true, message: customer },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // cutomer preview dialog closed
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

  changeRibbonState() {
    if (this.ribbonopened === true) {
      this.ribbonopened = false;
    } else {
      this.ribbonopened = true;
    }
  }

  return() {
    this._location.back();
  }

  openSearchCustomerGroupDialog(): void {
    const dialogRef = this.dialog.open(CustomerGroupSearchComponent, {
      width: '550px',
      data: { show: true, },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // batch invoice dialog closed
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

}

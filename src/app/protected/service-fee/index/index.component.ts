import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ServiceFee } from 'src/app/models/service-fee.model';
import { CustomerGroup } from 'src/app/models/customer-group.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';
import { Service } from 'src/app/models/service.model';
import { Tax } from 'src/app/models/tax.model';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { CustomerGroupService } from '../../customer-group/customer-group.service';
import { PaymentCycleService } from '../../payment-cycle/payment-cycle.service';
import { ServiceFeeService } from '../service-fee.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { ToastService } from 'src/app/providers/toast.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { PreviewServiceFeeComponent } from '../preview-service-fee/preview-service-fee.component';
import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'amount',
    'description',
    'actions'
  ];

  dataSource = new MatTableDataSource<ServiceFee>();

  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild('matMenuTrigger', { static: true }) trigger: MatMenuTrigger | any;

  companyId: string = '';

  serviceFees: ServiceFee[] = [];
  paymentsGroup: CustomerGroup[] = [];
  paymentCycles: PaymentCycle[] = [];
  Services: Service[] = [];
  taxes: Tax[] = [];
  pgIdpassed: string = '';
  pcIdpassed: string = '';
  queryString: string = '';
  index: number | any;
  model: any;
  public claims: any;
  public showFilter = false;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'customerGroupId': new FormControl('', [Validators.required]),
    'paymentCycleId': new FormControl('', [Validators.required]),
  });

  pageSize = 10;
  busy: boolean = false;
  page = 1;
  pageSizeOptions: number[] = [5, 10, 25];
  searchText = '';
  sortOrder = 'asc';
  pages: number | any;
  customerGroupList: CustomerGroup[] = [];
  public customerGroupName = new FormControl({ value: '', disabled: true });
  public customerGroupExists: boolean = false;
  public selectedCustomerGroup!: CustomerGroup;
  public customerGroupId: string = '';
  public paymentCycleName = new FormControl({ value: '', disabled: true });
  public paymentCycleExists: boolean = false;
  public selectedpaymentCycle!: PaymentCycle;
  public paymentCycleId: string = '';

  constructor(
    public dialog: MatDialog,
    public route: Router,
    private customerGroupService: CustomerGroupService,
    private paymentCycleService: PaymentCycleService,
    private svcfeeService: ServiceFeeService,
    private storageService: StorageService,
    private messageService: MessageService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.initialize();
    this.dataSource.paginator = this.paginator;

    // search customer group after every key stroke
    this.customerGroupName.valueChanges
      .subscribe(value => {
        if (value.length >= 0) {
          this.searchCustomerGroup(value)
            .then((result: SearchResult) => {
              this.customerGroupList = result.data;
              this.customerGroupValidator();
              this.customerGroupName.updateValueAndValidity({ emitEvent: false });
            })
        }
        else {
          return null;
        }
      });

    // search payment cycle after every key stroke
    this.paymentCycleName.valueChanges
      .subscribe(value => {
        if (value.length >= 1) {
          this.searchPaymentCycle(value)
            .then((result: SearchResult) => {
              this.paymentCycles = result.data;
              this.paymentCycleValidator();
              this.paymentCycleName.updateValueAndValidity({ emitEvent: false });
            })
        }
        else {
          return null;
        }
      });

    // get all customer groups
    if (this.claims && this.claims.doceipt_claim_customergroup_access) {
      this.customerGroupName.enable();
      this.searchCustomerGroup('').then((result: SearchResult) => {
        this.customerGroupList = result.data;
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

    // get all payment cycles
    if (this.claims && this.claims.doceipt_claim_paymentcycle_access) {
      this.paymentCycleName.enable();
      this.searchPaymentCycle('').then((result: SearchResult) => {
        this.paymentCycles = result.data;
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
  }

  pageEvent(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.search(this.customerGroupId, "");
  }

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public searchCustomerGroup(value: string): Promise<any> {
    return this.customerGroupService.searchCustomerGroup(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  private search(customerGroupId: string, paymentCycleId: string) {
    this.searchServiceFees(customerGroupId, paymentCycleId).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<ServiceFee>(result.data);
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

  public searchPaymentCycle(value: string): Promise<any> {
    return this.paymentCycleService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public searchServiceFees(customerGroupId?: string, paymentCycleId?: string, active?: boolean,): Promise<any> {
    return this.svcfeeService.search(this.companyId, this.searchText,
      this.page, this.pageSize, this.sortOrder, customerGroupId, paymentCycleId, active).toPromise();
  }

  initialize(reload?: boolean) {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.customerGroupList = [];
    this.search(this.customerGroupId, "");

    if ((this.claims && this.claims.doceipt_claim_paymentcycle_access) ||
      (this.claims && this.claims.doceipt_claim_customergroup_access)) {
      this.showFilter = true;
    }
  }

  deleteServiceFee(id: string): Promise<any> {
    return this.svcfeeService.delete(id).toPromise();
  }

  getDeleteDialog(element: ServiceFee, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the service fee <br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: ServiceFee) {
    const dialogRef = this.getDeleteDialog(element, 'delete');

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.deleteServiceFee(result)
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

  // pcServiceFee($event: any, pc: any) {
  //   $event.stopPropagation();
  //   this.pcIdpassed = pc;
  // }

  filterServiceFee() {
    this.busy = true;
      this.searchServiceFees(this.customerGroupExists ? this.customerGroupId : "", this.paymentCycleExists ? this.paymentCycleId : "")
        .then((result: SearchResult) => {
          this.serviceFees = result.data;
          this.dataSource.data = this.serviceFees;
          const filtered = this.serviceFees;
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

  edit(arg: any, index: number) {
    this.index = index;
    this.storageService.setData('data', arg);
    this.route.navigate(['protected/service-fee/edit']);
  }

  openDialog(serviceFee: ServiceFee): void {
    const dialogRef = this.dialog.open(PreviewServiceFeeComponent, {
      width: '850px',
      data: { show: true, message: serviceFee },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // dialog closed
    });

    dialogRef.backdropClick().subscribe(() => {
      // allow closing the dialog on backdrop click
      dialogRef.close();
    });
  }

  addServiceFee() {
    this.route.navigate(['protected/service-fee/add']);
  }

  public customerGroupValidator(): any {
    this.customerGroupExists = false;
    let customerGroup = this.customerGroupName.value;
    if (customerGroup.length === 0) {
      this.customerGroupId = "";
      this.customerGroupName.clearValidators();
      return;
    }
    for (let i = 0; i < this.customerGroupList.length; i++) {
      if (this.customerGroupList[i].name === customerGroup) {
        this.customerGroupExists = true;
        this.selectedCustomerGroup = this.customerGroupList[i];
        this.customerGroupId = this.selectedCustomerGroup.id;
        this.customerGroupName.clearValidators();
      }
    }
    if (!this.customerGroupExists) {
      this.customerGroupExists = false;
      this.customerGroupName.setValidators(f => <any>{ notvalid: true });
    }
  }

  public paymentCycleValidator(): any {
    this.paymentCycleExists = false;
    let pc = this.paymentCycleName.value;
    if (pc.length === 0) {
      this.paymentCycleId = "";
      this.paymentCycleName.clearValidators();
      return;
    }
    for (let i = 0; i < this.paymentCycles.length; i++) {
      if (this.paymentCycles[i].name === pc) {
        this.paymentCycleExists = true;
        this.selectedpaymentCycle = this.paymentCycles[i];
        this.paymentCycleId = this.selectedpaymentCycle.id;
        this.paymentCycleName.clearValidators();
      }
    }
    if (!this.paymentCycleExists) {
      this.paymentCycleExists = false;
      this.paymentCycleName.setValidators(f => <any>{ notvalid: true });
    }
  }

}

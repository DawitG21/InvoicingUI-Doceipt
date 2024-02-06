import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { CustomerEdit } from 'src/app/models/customer-edit.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { CustomerGroup } from 'src/app/models/customer-group.model';
import { BillingAddress } from 'src/app/models/billing-address.model';
import { Customer } from 'src/app/models/customer.model';

import { ToastService } from 'src/app/providers/toast.service';
import { CustomerService } from '../customer.service';
import { CustomerGroupService } from '../../customer-group/customer-group.service';
import { BranchService } from '../../branch/branch.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { BillingAddressService } from '../billing-address.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { CustomerGroupSearchComponent } from '../../customer-group/customer-group-search/customer-group-search.component';
import { AssignContactDialogComponent } from '../assign-contact-dialog/assign-contact-dialog.component';
import { BillingAddressDialogComponent } from '../billing-address-dialog/billing-address-dialog.component';
import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})

export class EditCustomerComponent implements OnInit, OnDestroy {

  // model: CustomerEdit | any;
  model!: CustomerEdit;
  status: boolean = false;
  saveStatus: boolean = false;
  message: string = '';
  companyId = '';
  customerGroups: any = [];
  branches: any = [];
  searchText = '';
  pageSize = 10;
  pages: number | any;
  page = 1;
  subscription: Subscription;
  customerGroup: CustomerGroup | any;
  name: string = '';
  busy: boolean = false;
  public billingAddresses: BillingAddress[] = [];
  private customerKey = 'customer';
  private contactsKey = 'contacts';
  claims: any;
  fromQueryParam: string;
  customerGroupDisabled = true;
  // customer!: Customer;

  form = new FormGroup({
    'id': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'referenceId': new FormControl('', [Validators.required]),
    'customerGroupId': new FormControl('', [Validators.required]),
    'branchId': new FormControl({ value: '', disabled: true }),
    'isActive': new FormControl,
  });

  public dataSource = new MatTableDataSource<BillingAddress>();
  public displayedColumns: string[] = [
    'name',
    'primaryEmail',
    'relationship',
    'primaryPhone',
    'actions',
  ];
  public data: any;

  constructor(
    private customerService: CustomerService,
    private toastService: ToastService,
    private customerGroupService: CustomerGroupService,
    private branchService: BranchService,
    private storageService: StorageService,
    private messageService: MessageService,
    public dialog: MatDialog,
    private broadcastService: BroadcastService,
    private router: Router,
    private billingAddressService: BillingAddressService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
    this.fromQueryParam = this.route.snapshot.queryParamMap.get('from') ?? '';
    this.initialize();
    this.data = this.storageService.getData('data');
    this.initForm();

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.customerGroupSearchSender) {
          this.customerGroup = message.data;
          this.name = this.customerGroup.name;
          this.form.get('customerGroupId')!.setValue(this.customerGroup.id);
        } else if (message.sender === this.messageService.contactSearchSender) {
          const data = new BillingAddress();
          data.contact = message.data;
          this.billingAddresses.push(data);
          this.openBillingAddressDialog(data, this.messageService.billingAddressAddSender);
        } else if (message.sender === this.messageService.billingAddressAdded) {
          // const lastIndex = this.billingAddresses.length - 1;
          const lastIndex = this.billingAddresses.length == 0 ? 0 : this.billingAddresses.length - 1;
          this.billingAddresses[lastIndex] = message.data;
          this.dataSource = new MatTableDataSource<BillingAddress>(this.billingAddresses);
        } else if (message.sender === this.messageService.billingAddressUpdated) {
          for (const billingAddress of this.billingAddresses) {
            if (message.data.id === billingAddress.id) {
              const index = this.billingAddresses.indexOf(billingAddress);
              this.billingAddresses[index] = message.data;
              this.dataSource = new MatTableDataSource<BillingAddress>(this.billingAddresses);
            }
          }
        }
      });
  }

  public initForm() {
    this.customerGroup = new CustomerGroup();
    let data: Customer | any = this.storageService.getData(this.customerKey);
    let contactData: BillingAddress | any;

    if (data) {
      this.model.id = data.id;
      this.model.name = data.name;
      this.model.referenceId = data.referenceId;
      this.model.isActive = data.isActive;

      if (this.fromQueryParam && this.fromQueryParam !== '') {
        this.model.customerGroupId = data.customerGroupId;
        this.model.branchId = data.branchId;
      } else {
        this.model.customerGroupId = data.customerGroup.id;
        this.model.branchId = data.branch.id;
        // newly added
        this.billingAddresses = data.billingAddresses;
        this.dataSource = new MatTableDataSource<BillingAddress>(this.billingAddresses);
      }

      if (this.claims && this.claims.doceipt_claim_customergroup_access) {
        this.customerGroupGet();
      }
      this.populateData(this.model);
      this.storageService.deleteData(this.customerKey);

      contactData = this.storageService.getData(this.contactsKey);

      if (contactData) {
        this.billingAddresses = contactData;
        // this.billingAddresses.push(contactData);
        this.dataSource = new MatTableDataSource<BillingAddress>(this.billingAddresses);
        const lastIndex = this.billingAddresses.length == 0 ? 0 : this.billingAddresses.length - 1;
        // if (!this.billingAddresses[lastIndex].id) {
        //   this.openBillingAddressDialog(this.billingAddresses[lastIndex], this.messageService.billingAddressAddSender);
        // }
        this.storageService.deleteData(this.contactsKey);
      }
    } else {
      this.model = this.data;
      this.model.customerGroupId = this.data.customerGroup.id;
      this.model.branchId = this.data.branch.id;

      if (this.claims && this.claims.doceipt_claim_contact_access) {
        this.billingAddresses = this.data.billingAddresses;
        this.dataSource = new MatTableDataSource<BillingAddress>(this.billingAddresses);
      }
      if (this.claims && this.claims.doceipt_claim_customergroup_access) {
        this.customerGroupGet();
      }

      this.populateData(this.model);
    }
  }

  public populateData(arg: CustomerEdit) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('referenceId')!.setValue(arg.referenceId);
    this.form.get('customerGroupId')!.setValue(arg.customerGroupId);
    this.form.get('branchId')!.setValue(arg.branchId);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.markAsUntouched();
  }

  public getCustomerGroup(id: string): Promise<any> {
    return this.customerGroupService.get(id).toPromise();
  }

  public customerGroupGet(): void {
    this.busy = true;
    this.getCustomerGroup(this.model.customerGroupId).then((result) => {
      this.customerGroup = result;
      this.name = this.customerGroup.name;
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

  ngOnInit() {
    this.setStatus(this.model.isActive);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initialize() {
    this.companyId = this.storageService.getCompanyId;
    this.model = new CustomerEdit();
    this.claims = this.authService.userClaims;
    this.customerGroup = new CustomerGroup();
    if (this.claims && this.claims.doceipt_claim_branch_access) {
      this.form.get('branchId')!.enable();
      this.searchBranch();
    }
    if (this.claims && this.claims.doceipt_claim_customergroup_access) {
      this.customerGroupDisabled = false;
    }
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

  goBack() {
    this.router.navigate(['protected/customer']);
  }

  editCustomer(customer: CustomerEdit): Promise<any> {
    return this.customerService.update(customer).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as CustomerEdit;
    this.model.branchId = this.form.get('branchId')!.value;
    if (!this.customerService.isModelValid(this.model)) {
      this.toastService.warning(this.messageService.mandatoryFields);
      this.busy = false;
      return;
    }

    this.editCustomer(this.model).then((response: Customer) => {
      const arg: CustomerEdit = new CustomerEdit();
      arg.id = response.id;
      arg.name = response.name;
      arg.referenceId = response.referenceId;
      arg.isActive = response.isActive;
      arg.branchId = response.branch.id;
      arg.customerGroupId = response.customerGroup.id;

      this.populateData(arg);
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = true;
    }, (reject) => {
      this.toastService.error(reject);
      this.saveStatus = false;
    })
      .catch((error) => {
        this.toastService.error(error);
        this.saveStatus = false;
      })
      .finally(() => {
        this.busy = false;
        this.saveStatus = false;
      });
  }

  setStatus(e: any) {
    if (e) {
      this.message = 'Active';
      this.status = true;
    } else {
      this.message = 'Inactive';
      this.status = false;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CustomerGroupSearchComponent, {
      width: '550px',
      data: { show: true, },
      disableClose: true
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

  getAssignContactDialog(action: string) {
    return this.dialog.open(AssignContactDialogComponent, {
      width: '450px',
      data: {
        input: action
      },
    });
  }

  openAssignContactDialog(): void {
    const dialogRef = this.getAssignContactDialog('add new contact');

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'add new contact') {
        this.goContactAdd();
      }
    });

    dialogRef.backdropClick().subscribe(() => {
      // allow closing the dialog only on backdrop click
      dialogRef.close();
    });
  }

  goContactAdd() {
    this.model = this.form.value as CustomerEdit;
    this.storageService.setData(this.customerKey, this.model);
    if (this.billingAddresses.length > 0) {
      this.storageService.setData(this.contactsKey, this.billingAddresses);
    }
    this.router.navigate(['protected/contact/add'], {
      queryParams: { from: 'protected/customer/edit' },
    });
  }

  public billingAddressDialog(billingAddress: BillingAddress, message: string) {
    const data = {
      billingAddress: billingAddress,
      customerId: this.model.id,
    };
    return this.dialog.open(BillingAddressDialogComponent, {
      data: { input: data, message: message, },
      disableClose: true,
      width: '600px',
    });
  }

  public openBillingAddressDialog(billingAddress: BillingAddress, message: string) {
    const dialogRef = this.billingAddressDialog(billingAddress, message);

    dialogRef.afterClosed().subscribe(result => {
      dialogRef.close();
    });

    dialogRef.backdropClick().subscribe(() => {
    });
  }

  public edit(element: BillingAddress) {
    this.openBillingAddressDialog(element, this.messageService.billingAddressUpdateSender);
  }

  public deleteBillingAddress(id: string): Promise<any> {
    return this.billingAddressService.delete(id).toPromise();
  }

  public getDeleteDialog(element: BillingAddress) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: element.id,
        message: `Are you sure you want to delete the billing address<br>
        <b>${element.contact.name}</b>?`,
      },
      width: '450px',
    });
  }

  public openDeleteDialog(element: BillingAddress) {
    const dialogRef = this.getDeleteDialog(element);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.deleteBillingAddress(result)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            const filtered = data.filter((e) => e.id !== result);
            this.dataSource.data = filtered;
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

  get customerGroupChanged() {
    return (this.customerGroup.id !== this.model.customerGroupId);
  }
}

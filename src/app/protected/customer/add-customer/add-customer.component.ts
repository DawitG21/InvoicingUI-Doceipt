import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CustomerGroup } from 'src/app/models/customer-group.model';
import { CustomerNew } from 'src/app/models/customer-new.model';
import { Branch } from 'src/app/models/branch.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { BillingAddressNew } from 'src/app/models/billing-address-new.model';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { BranchService } from '../../branch/branch.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { CustomerService } from '../customer.service';
import { ToastService } from 'src/app/providers/toast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { CustomerGroupService } from '../../customer-group/customer-group.service';

import { AssignContactDialogComponent } from 'src/app/protected/customer/assign-contact-dialog/assign-contact-dialog.component';
import { CustomerGroupSearchComponent } from '../../customer-group/customer-group-search/customer-group-search.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})

export class AddCustomerComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'referenceId': new FormControl('', [Validators.required]),
    'customerGroupId': new FormControl('', [Validators.required]),
    'branchId': new FormControl({ value: '', disabled: true }),
    'isActive': new FormControl,
    'billingAddresses': new FormControl([], [Validators.required]),
  });

  companyId: string = '';
  model: CustomerNew | any;
  message: string = '';
  status: boolean = false;
  saveStatus: boolean = false;
  branches: Branch[] = [];
  customerGroups: CustomerGroup[] = [];
  subscription: Subscription;
  contacts: any[] = [];
  customerKey = 'customer';
  contactsKey = 'contacts';
  customerGroup: CustomerGroup | any;
  busy: boolean = false;
  page = 1;
  pageSizeOptions: number[] = [5, 10, 25];
  searchText = '';
  pageSize = 10;
  pages: number | any;
  billingAddress: BillingAddressNew[] = [];
  contactMessage: BroadcastMessage | any;
  name: string = '';
  claims: any;
  customerGroupDisabled = true;
  contactAssignDisabled = true;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private branchService: BranchService,
    private broadcastService: BroadcastService,
    private customerService: CustomerService,
    private toastService: ToastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private customerGroupService: CustomerGroupService,
  ) {
    this.initialize();
    this.initForm();

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.contactSearchSender) {
          this.addContact(message);
        } else if (message.sender === this.messageService.customerGroupSearchSender) {
          this.customerGroup = message.data;
          this.form.get('customerGroupId')!.setValue(this.customerGroup.id);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    if (this.claims && this.claims.doceipt_claim_branch_access) {
      this.form.get('branchId')!.enable();
      this.searchBranch();
    }
    if (this.claims && this.claims.doceipt_claim_customergroup_access) {
      this.customerGroupDisabled = false;
    }
    if (this.claims && this.claims.doceipt_claim_contact_access) {
      this.contactAssignDisabled = false;
    }
    this.form.get('companyId')!.setValue(this.companyId);
    this.form.get('isActive')!.setValue(this.model.isActive);
    this.setStatus(this.model.isActive);
  }

  initialize() {
    this.branches = [];
    this.billingAddress = [];
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

  initForm() {
    this.customerGroup = new CustomerGroup();
    let data = this.storageService.getData(this.customerKey);

    if (data) {
      this.model = data;
      if (this.model.customerGroupId) {
        this.customerGroupGet();
      }
      this.form.get('name')!.setValue(this.model.name);
      this.form.get('referenceId')!.setValue(this.model.referenceId);
      this.form.get('customerGroupId')!.setValue(this.model.customerGroupId);
      this.form.get('branchId')!.setValue(this.model.branchId);
      this.form.get('isActive')!.setValue(this.model.isActive);
      this.storageService.deleteData(this.customerKey);
      data = this.storageService.getData(this.contactsKey);

      if (data) {
        this.contactMessage = new BroadcastMessage('', data);
        this.addContact(this.contactMessage);
        this.storageService.deleteData(this.contactsKey);
      }
    } else {
      this.model = new CustomerNew(this.companyId);
      this.contacts = [];
      this.billingAddress = [];
      this.form.reset();
    }
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

  addCustomer(customer: CustomerNew): Promise<any> {
    return this.customerService.create(customer).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as CustomerNew;
    this.model.billingAddresses = this.billingAddress;

    if (!this.customerService.isModelValid(this.model)) {
      this.toastService.warning(this.messageService.mandatoryFields);
      this.busy = false;
      this.saveStatus = false;
      return;
    }

    if (this.model.billingAddresses.length === 0) {
      this.toastService.warning(this.messageService.customerLinkContact);
      this.busy = false;
      this.saveStatus = false;
      return;
    }

    this.addCustomer(this.model).then(() => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
      this.initForm();
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

  goContactAdd() {
    this.model = this.form.value as CustomerNew;
    this.storageService.setData(this.customerKey, this.model);
    if (this.contacts.length > 0) {
      this.storageService.setData(this.contactsKey, this.contacts);
    }
    this.router.navigate(['protected/contact/add'], {
      queryParams: { from: 'protected/customer/add' },
    });
  }

  goBack() {
    this.router.navigate(['protected/customer']);
  }

  addContact(message: any) {
    let matched = 0;
    const billingAddress = new BillingAddressNew();
    billingAddress.contactId = message.data.id;
    if (!this.billingAddress || this.billingAddress.length === 0) {
      this.billingAddress = [];
      this.contacts.push(message.data);
      this.billingAddress.push(billingAddress);
    } else {
      for (let i = 0; i < this.billingAddress.length; i++) {
        if (message.data.id === this.billingAddress[i].contactId) {
          matched = 1;
        }
      }
      if (matched === 0) {
        this.contacts.push(message.data);
        this.billingAddress.push(billingAddress);
      } else {
        this.toastService.warning(this.messageService.contactAddedSender);
      }
    }
  }

  removeContact(index: number) {
    this.billingAddress.splice(index, 1);
    this.contacts.splice(index, 1);
  }

  getAssignContactDialog(action: string) {
    return this.dialog.open(AssignContactDialogComponent, {
      width: '450px',
      data: {
        input: action
      },
    });
  }

  openDialog(): void {
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

  openSearchCustomerGroupDialog(): void {
    const dialogRef = this.dialog.open(CustomerGroupSearchComponent, {
      width: '550px',
      data: { show: true, },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // batch invoice dialog closed'
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

}

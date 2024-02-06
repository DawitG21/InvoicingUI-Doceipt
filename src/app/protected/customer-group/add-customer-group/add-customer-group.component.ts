import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastService } from 'src/app/providers/toast.service';
import { CustomerGroupService } from '../customer-group.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import { CustomerGroupNew } from 'src/app/models/customer-group-new.model';

@Component({
  selector: 'app-add-customer-group',
  templateUrl: './add-customer-group.component.html',
  styleUrls: ['./add-customer-group.component.scss']
})

export class AddCustomerGroupComponent implements OnInit {

  model: CustomerGroupNew | any;
  companyId: string = '';
  message: string = '';
  status: boolean = false;
  public busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'orderNo': new FormControl('', [Validators.required]),
    'description': new FormControl(''),
    'isActive': new FormControl,
  });

  constructor(
    private location: Location,
    private customerGroupService: CustomerGroupService,
    private toastService: ToastService,
    private storageService: StorageService,
    private messageService: MessageService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.form.get('companyId')!.setValue(this.companyId);
    this.form.get('isActive')!.setValue(this.model.isActive);
    this.setStatus(this.model.isActive);
  }

  initForm() {
    this.model = new CustomerGroupNew(this.companyId);
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

  addCustomerGroup(customerGroup: CustomerGroupNew): Promise<any> {
    return this.customerGroupService.create(customerGroup).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as CustomerGroupNew;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }
    this.addCustomerGroup(this.model).then(() => {
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

  goBack() {
    this.location.back();
  }

}

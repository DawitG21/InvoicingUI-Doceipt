import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastService } from 'src/app/providers/toast.service';
import { CustomerGroupService } from '../customer-group.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import { CustomerGroup } from 'src/app/models/customer-group.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-customer-group',
  templateUrl: './edit-customer-group.component.html',
  styleUrls: ['./edit-customer-group.component.scss'],
})
export class EditCustomerGroupComponent implements OnInit {

  model: CustomerGroup;
  status: boolean = false;
  message: string = '';
  public busy: boolean = false;
  saveStatus: boolean = false;

  form = new FormGroup({
    'id': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'orderNo': new FormControl('', [Validators.required]),
    'description': new FormControl(''),
    'isActive': new FormControl,
  });

  constructor(
    private customerGroupService: CustomerGroupService,
    private toastService: ToastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private route: Router,
  ) {
    this.model = this.storageService.getData('data');
    this.populateData(this.model);
  }

  ngOnInit() {
    this.setStatus(this.model.isActive);
  }

  editCustomerGroup(customerGroup: CustomerGroup): Promise<any> {
    return this.customerGroupService.update(customerGroup).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true
    this.model = this.form.value as CustomerGroup;

    this.editCustomerGroup(this.model).then((result: CustomerGroup) => {
      this.populateData(result);
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
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

  return() {
    this.route.navigate(['/protected/customer-group']);
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

  public populateData(arg: CustomerGroup) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('orderNo')!.setValue(arg.orderNo);
    this.form.get('description')!.setValue(arg.description);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.markAsUntouched();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Source } from 'src/app/models/source.model';

import { ToastService } from 'src/app/providers/toast.service';
import { SourceService } from '../source.service';
import { MessageService } from 'src/app/providers/message.service';
import { StorageService } from 'src/app/providers/storage.service';

@Component({
  selector: 'app-edit-source',
  templateUrl: './edit-source.component.html',
  styleUrls: ['./edit-source.component.scss']
})
export class EditSourceComponent implements OnInit {

  companyId: string = '';
  message: string = '';
  status: boolean = false;
  model: Source;
  public busy: boolean = false;
  public saveStatus: boolean = false;

  form = new FormGroup({
    'id': new FormControl('', [Validators.required]),
    'isActive': new FormControl,
    'name': new FormControl(''),
    'customerGroupUrl': new FormControl(''),
    'contactUrl': new FormControl(''),
    'branchUrl': new FormControl(''),
    'customerUrl': new FormControl(''),
    'authType': new FormControl(''),
    'authUrl': new FormControl({ value: '', disabled: true }),
    'authToken': new FormControl({ value: '', disabled: true }),
    'authUsername': new FormControl({ value: '', disabled: true }),
    'authPassword': new FormControl({ value: '', disabled: true }),
  });

  authTypes = ['none', 'basic', 'token'];

  constructor(
    private storageService: StorageService,
    private toastService: ToastService,
    private route: Router,
    private sourceService: SourceService,
    private messageService: MessageService,
  ) {
    this.model = this.storageService.getData('data');
    this.populateData(this.model);
  }

  ngOnInit() {
    this.setStatus(this.model.isActive);
  }

  public populateData(arg: Source) {
    this.enableInput(arg.authType);
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.get('customerGroupUrl')!.setValue(arg.customerGroupUrl);
    this.form.get('contactUrl')!.setValue(arg.contactUrl);
    this.form.get('branchUrl')!.setValue(arg.branchUrl);
    this.form.get('customerUrl')!.setValue(arg.customerUrl);
    this.form.get('authType')!.setValue(arg.authType);
    this.form.get('authUrl')!.setValue(arg.authUrl);
    this.form.get('authToken')!.setValue(arg.authToken);
    this.form.get('authUsername')!.setValue(arg.authUsername);
    this.form.get('authPassword')!.setValue(arg.authPassword);
    this.form.markAsUntouched();
  }

  editSource(source: Source): Promise<any> {
    return this.sourceService.update(source).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as Source;

    this.editSource(this.model).then((result: Source) => {
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

  setStatus(e: any) {
    if (e) {
      this.message = 'Active';
      this.status = true;
    } else {
      this.message = 'Inactive';
      this.status = false;
    }
  }

  goBack() {
    this.route.navigate(['/protected/settings']);
  }

  enableInput(value: string) {
    this.form.get('authUrl')!.setValue('');
    this.form.get('authToken')!.setValue('');
    this.form.get('authUsername')!.setValue('');
    this.form.get('authPassword')!.setValue('');
    this.form.get('authUrl')!.disable();
    this.form.get('authToken')!.disable();
    this.form.get('authUsername')!.disable();
    this.form.get('authPassword')!.disable();

    if (value === 'basic' || value === 'token') {
      this.form.get('authUrl')!.enable();
    }

    if (value === 'token') {
      this.form.get('authToken')!.enable();
    }

    if (value === 'basic') {
      this.form.get('authUsername')!.enable();
      this.form.get('authPassword')!.enable();
    }
  }

}

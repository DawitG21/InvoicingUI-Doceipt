import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { SourceService } from '../source.service';
import { MessageService } from 'src/app/providers/message.service';

import { SourceNew } from 'src/app/models/source-new.model';

@Component({
  selector: 'app-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.scss']
})
export class AddSourceComponent implements OnInit {

  companyId: string = '';
  message: string = '';
  status: boolean = false;
  model: SourceNew | any;
  public busy: boolean = false;
  public saveStatus: boolean = false;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
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
    private router: Router,
    private storageService: StorageService,
    private toastService: ToastService,
    private location: Location,
    private sourceService: SourceService,
    private messageService: MessageService,
  ) {
    this.initForm();
  }

  initialize() {
    this.model = new SourceNew(this.companyId);
    this.companyId = this.storageService.getCompanyId;
    this.form.get('companyId')!.setValue(this.companyId);
    this.form.get('isActive')!.setValue(this.model.isActive);
  }

  ngOnInit() {
    this.initialize();
    this.setStatus(this.model.isActive);
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

  goAddRole() {
    this.router.navigate(['/protected/company/manage-role']);
  }

  goInviteUser() {
    this.router.navigate(['/protected/company/manage-org']);
  }

  goBack() {
    this.location.back();
  }

  enableInput(value: string) {
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

  initForm() {
    this.model = new SourceNew(this.companyId);
    this.form = new FormGroup({
      'companyId': new FormControl('', [Validators.required]),
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
    this.initialize();
  }

  addSource(source: SourceNew): Promise<any> {
    return this.sourceService.create(source).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as SourceNew;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addSource(this.model).then((result) => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.initForm();
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

}

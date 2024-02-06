import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MachineService } from '../machine.service';
import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';
import { StorageService } from 'src/app/providers/storage.service';

import { MachineNew } from 'src/app/models/machine-new.model';

@Component({
  selector: 'app-add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.scss']
})

export class AddMachineComponent implements OnInit {

  subscription: Subscription | any;
  model: MachineNew | any;
  companyId: string = '';
  message: string = '';
  status: boolean = false;
  public busy: boolean = false;

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'machineNo': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'brand': new FormControl(null),
    'model': new FormControl(null),
    'serial': new FormControl(null),
    'isActive': new FormControl(null),
  });

  constructor(
    private machineService: MachineService,
    private toastService: ToastService,
    private messageService: MessageService,
    private location: Location,
    private storageService: StorageService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.form.get('companyId')!.setValue(this.companyId);
    this.form.get('isActive')!.setValue(this.model.isActive);
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

  goBack() {
    this.location.back();
  }

  initForm() {
    this.model = new MachineNew(this.companyId);
  }

  addMachine(machine: MachineNew): Promise<any> {
    return this.machineService.create(machine).toPromise();
  }

  save() {
    this.busy = true;
    this.model = this.form.value as MachineNew;
    if (!this.machineService.isModelValid(this.model)) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }
    this.addMachine(this.model).then(() => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.initForm();
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

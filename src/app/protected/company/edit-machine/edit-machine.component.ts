import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageService } from 'src/app/providers/storage.service';
import { MachineService } from '../machine.service';
import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';

import { Machine } from 'src/app/models/machine.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-machine',
  templateUrl: './edit-machine.component.html',
  styleUrls: ['./edit-machine.component.scss']
})
export class EditMachineComponent implements OnInit {

  model: Machine;
  subscription: Subscription | any;
  status: boolean = false;
  message: string = '';
  companyId: string = '';
  public busy: boolean = false;

  form = new FormGroup({
    'id': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'machineNo': new FormControl('', [Validators.required]),
    'brand': new FormControl('', [Validators.required]),
    'model': new FormControl('', [Validators.required]),
    'serial': new FormControl('', [Validators.required]),
    'isActive': new FormControl(''),
  });

  constructor(
    private storageService: StorageService,
    private machineService: MachineService,
    private toastService: ToastService,
    private messageService: MessageService,
    public route: Router,
  ) {
    this.model = this.storageService.getData('data');
    if (this.model) {
      this.populateData(this.model);
    }
  }

  ngOnInit() {
    this.setStatus(this.model.isActive);
    this.companyId = this.storageService.getCompanyId;
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
    this.route.navigate(['/protected/company'], { queryParams: { id: this.companyId } });
  }

  editMachine(machineDetail: Machine) {
    return this.machineService.update(machineDetail).toPromise();
  }

  save() {
    this.busy = true;
    this.model = this.form.value as Machine;
    if (!this.machineService.isModelValid(this.model)) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.editMachine(this.model).then((result: Machine) => {
      this.populateData(result);
      this.toastService.success(this.messageService.operationSuccesful);
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

  public populateData(arg: Machine) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('machineNo')!.setValue(arg.machineNo);
    this.form.get('brand')!.setValue(arg.brand);
    this.form.get('model')!.setValue(arg.model);
    this.form.get('serial')!.setValue(arg.serial);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.markAsUntouched();
  }

}

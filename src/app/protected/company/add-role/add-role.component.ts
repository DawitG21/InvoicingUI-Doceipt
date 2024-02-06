import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { Claim } from 'src/app/models/claim.model';
import { RoleNew } from 'src/app/models/role-new.model';
import { RoleReport } from 'src/app/models/role-report.model';

import { ToastService } from 'src/app/providers/toast.service';
import { RoleService } from '../role.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-add-role',
  styleUrls: ['./add-role.component.scss'],
  templateUrl: './add-role.component.html',
})
export class AddRoleComponent implements OnInit {

  public model: RoleNew | any;
  public companyId: string = '';
  public roleReports: RoleReport[] = [];
  public busy: boolean = false;
  public claims: Claim[] = [];
  public claimsPiped: any;

  public form = new FormGroup({
    claims: new FormArray([]),
    description: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    reports: new FormArray([], [Validators.required]),
  });

  constructor(
    private location: Location,
    private roleService: RoleService,
    private storageService: StorageService,
    private toastService: ToastService,
    private messageService: MessageService,
  ) {
    this.initForm();
  }

  public ngOnInit(): void {
    this.companyId = this.storageService.getCompanyId;
    this.model.companyId = this.companyId;

    this.getClaims();
    this.getReports();
  }

  public getAllClaims(companyId: string): Promise<any> {
    return this.roleService.getClaims(companyId).toPromise();
  }

  public getClaims() {
    this.busy = true;
    this.getAllClaims(this.companyId).then((result) => {
      this.claims = result;
      this.claimsPiped = _.groupBy(this.claims, (claim: Claim) => {
        return claim.category.replace(/\s/g, '');
      });
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

  public getAllReports(companyId: string): Promise<any> {
    return this.roleService.getReports(companyId).toPromise();
  }

  public getReports() {
    this.busy = true;
    this.getAllReports(this.companyId).then((result) => {
      this.roleReports = result;
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

  public initForm() {
    this.form.reset();
    this.model = new RoleNew(this.companyId);
  }

  public goBack() {
    this.location.back();
  }

  public onCheckChange(event: any, arg: any) {
    let formArray: FormArray;
    if (arg === 'claim') {
      formArray = this.form.get('claims') as FormArray;
    } else {
      formArray = this.form.get('reports') as FormArray;
    }

    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      let i = 0;
      formArray.controls.forEach((ctrl, index, arrCtrl) => {
        if (ctrl.value.id === event.source.value.id) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  public addRole(model: RoleNew): Promise<any> {
    return this.roleService.create(model).toPromise();
  }

  public save() {
    this.busy = true;
    this.model = this.form.value as RoleNew;
    this.model.companyId = this.companyId;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addRole(this.model).then(() => {
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

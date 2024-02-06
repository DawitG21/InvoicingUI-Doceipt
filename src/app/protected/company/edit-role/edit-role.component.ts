import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { RoleReport } from 'src/app/models/role-report.model';
import { Role } from 'src/app/models/role.model';
import { Claim } from 'src/app/models/claim.model';

import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';
import { RoleService } from '../role.service';

import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-role',
  styleUrls: ['./edit-role.component.scss'],
  templateUrl: './edit-role.component.html',
})
export class EditRoleComponent implements OnInit {

  public model: Role;
  public companyId: string = '';
  public roleReports: RoleReport[] = [];
  public selectedRoleReports: RoleReport[] = [];
  public busy: boolean = false;
  public claims: Claim[] = [];
  public claimsPiped: any;
  public selectedClaims: Claim[] = [];

  public form = new FormGroup({
    claims: new FormArray([]),
    description: new FormControl(''),
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    reports: new FormArray([], [Validators.required]),
  });

  constructor(
    private storageService: StorageService,
    private toastService: ToastService,
    private messageService: MessageService,
    private roleService: RoleService,
    private route: Router,
  ) {
    this.model = this.storageService.getData('data');
    if (this.model) {
      this.populateData(this.model);
    }
  }

  public ngOnInit(): void {
    this.companyId = this.storageService.getCompanyId;
    this.getReports();
    this.getReports(this.model.id);
    this.getClaims();
    this.getClaims(this.model.id);
  }

  public getAllReports(companyId: string, roleId?: string): Promise<any> {
    return this.roleService.getReports(companyId, roleId).toPromise();
  }

  public getReports(roleId?: string) {
    this.busy = true;
    this.getAllReports(this.companyId, roleId).then((result) => {
      if (roleId) {
        this.selectedRoleReports = result;
        const formArray: FormArray = this.form.get('reports') as FormArray;
        formArray.clear();
        this.selectedRoleReports.forEach((roleReport) => {
          formArray.push(new FormControl(roleReport));
        });
      } else {
        this.roleReports = result;
      }
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

  public getAllClaims(companyId: string, roleId?: string): Promise<any> {
    return this.roleService.getClaims(companyId, roleId).toPromise();
  }

  public getClaims(roleId?: string) {
    this.busy = true;
    this.getAllClaims(this.companyId, roleId).then((result) => {
      if (roleId) {
        this.selectedClaims = result;
        const formArray: FormArray = this.form.get('claims') as FormArray;
        formArray.clear();
        this.selectedClaims.forEach((claim) => {
          formArray.push(new FormControl(claim));
        });
      } else {
        this.claims = result;
        this.claimsPiped = _.groupBy(this.claims, (claim: Claim) => {
          return claim.category.replace(/\s/g, '');
        });
      }
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

  public getReportCheckedValue(item: RoleReport) {
    if (!this.selectedRoleReports || this.selectedRoleReports.length === 0) {
      return false;
    }
    return this.selectedRoleReports.findIndex((x) => x.id === item.id) > -1;
  }

  public getClaimCheckedValue(item: RoleReport) {
    if (!this.selectedClaims || this.selectedClaims.length === 0) {
      return false;
    }
    return this.selectedClaims.findIndex((x) => x.id === item.id) > -1;
  }

  public goBack() {
    this.route.navigate(['/protected/company/manage-role']);
  }

  public EditRole(model: Role): Promise<any> {
    return this.roleService.update(model).toPromise();
  }

  public save() {
    this.busy = true;
    this.model = this.form.value as Role;

    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.EditRole(this.model).then((result: Role) => {
      this.populateData(result);
      this.getClaims(this.model.id);
      this.getReports(this.model.id);
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

  get claimsChanged() {
    let formValue: FormArray;
    formValue = this.form.get('claims')!.value as FormArray;
    if (formValue.length !== this.selectedClaims.length) {
      return true;
    } else {
      return false;
    }
  }

  get reportsChanged() {
    let formValue: FormArray;
    formValue = this.form.get('reports')!.value as FormArray;
    if (formValue.length !== this.selectedRoleReports.length) {
      return true;
    } else {
      return false;
    }
  }

  public populateData(arg: Role) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    if (arg.description) {
      this.form.get('description')!.setValue(arg.description);
    }
    this.form.markAsUntouched();
  }

}

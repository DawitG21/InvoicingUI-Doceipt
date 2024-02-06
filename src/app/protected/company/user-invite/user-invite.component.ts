import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { MessageService } from 'src/app/providers/message.service';
import { UserInviteService } from '../user-invite.service';
import { RoleService } from '../role.service';
import { BranchService } from '../../branch/branch.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { UserInviteNew } from 'src/app/models/user-invite-new.model';
import { Role } from 'src/app/models/role.model';
import { Branch } from 'src/app/models/branch.model';

@Component({
  selector: 'app-user-invite',
  styleUrls: ['./user-invite.component.scss'],
  templateUrl: './user-invite.component.html',
})

export class UserInviteComponent implements OnInit {

  public busy: boolean = false;
  public companyId: string = '';
  public model: UserInviteNew | any;
  public roles: Role[] = [];
  public role: Role | any;
  public status: boolean = false;
  public message: string = '';
  public disableBtn = false;
  public page = 1;
  public pageSize = 10;
  public branches: Branch[] = [];

  public form = new FormGroup({
    branches: new FormControl({ value: null, disabled: false }),
    companyId: new FormControl('', [Validators.required]),
    isOwner: new FormControl(false),
    roles: new FormControl({ value: null, disabled: false }),
    username: new FormControl('', [Validators.required]),
  });

  public getErrorMessage(field: string) {
    return this.form.get(field)!.hasError('required') ? 'You must enter a value' : '';
  }

  get getUserName() {
    return this.form.get('username');
  }

  constructor(
    private storageService: StorageService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    private userInviteService: UserInviteService,
    private roleService: RoleService,
    private branchService: BranchService,
  ) { }

  public ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.model = new UserInviteNew(this.companyId);
    this.form.get('companyId')!.setValue(this.companyId);
    this.setOwner(this.model.isOwner);
    this.loadRoles();
    this.getAllBranches();
  }

  public getAllRoles(companyId: string): Promise<any> {
    return this.roleService.getAll(companyId).toPromise();
  }

  public loadRoles() {
    this.busy = true;
    this.getAllRoles(this.companyId).then((result) => {
      this.roles = result;
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

  public setOwner(e: any) {
    if (e) {
      this.message = 'User will be invited as an owner';
      this.status = true;
      this.form.get("branches")?.setValue(null);
      this.form.get("roles")?.setValue(null);
      this.form.get("branches")?.disable();
      this.form.get("roles")?.disable();
    } else {
      this.message = 'User will be invited as a member';
      this.status = false;
      this.form.get("branches")?.enable();
      this.form.get("roles")?.enable();
    }
  }

  public inviteUser(model: UserInviteNew): Promise<any> {
    return this.userInviteService.create(model).toPromise();
  }

  public create() {
    this.model = this.form.value as UserInviteNew;
    this.busy = true;
    this.disableBtn = true;
    if (!this.userInviteService.isModelValid(this.model)) {
      this.toastService.warning(this.messageService.mandatoryFields);
      this.busy = false;
      return;
    }

    if (!this.model.isOwner && (!this.model.roles || this.model.roles.length === 0)) {
      this.toastService.warning('User must be assigned to a role or assigned owner priviledge');
      this.busy = false;
      return;
    }
    this.inviteUser(this.model).then((result) => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.broadcastService.broadcastTask(new BroadcastMessage(this.messageService.userInviteAddSender, result));
      this.form.reset();
    }, (reject) => {
      this.toastService.error(reject);
    })
      .catch((error) => {
        this.toastService.error(error);
      })
      .finally(() => {
        this.busy = false;
        this.disableBtn = false;
      });
  }

  public getAllBranches() {
    this.busy = true;
    this.branchService.getAll(this.companyId, this.page, this.pageSize)
      .then((result: Branch[]) => {
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

  get getRoles() {
    return this.form.get('roles');
  }

  get getRoleText() {
    const role = this.getRoles;
    return role!.value && role!.value.length >= 1 ? role!.value[0].name : '';
  }

  get getRolesConcat() {
    const role = this.getRoles;
    return `+${role!.value.length - 1} ${role!.value.length === 2 ? 'other' : 'others'}`;
  }

  get getBranches() {
    return this.form.get('branches');
  }

  get getBranchText() {
    const br = this.getBranches;
    return br!.value && br!.value.length >= 1 ? br!.value[0].name : '';
  }

  get getBranchConcat() {
    const br = this.getBranches;
    return `+${br!.value.length - 1} ${br!.value.length === 2 ? 'other' : 'others'}`;
  }
}

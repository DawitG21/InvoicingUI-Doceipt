import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

import { User } from 'src/app/models/user.model';
import { Branch } from 'src/app/models/branch.model';
import { Role } from 'src/app/models/role.model';

import { BranchService } from '../../branch/branch.service';
import { UserService } from '../user.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';
import { Router } from '@angular/router';
import { UserUpdate } from 'src/app/models/user-update.model';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
  selector: 'app-update-user',
  styleUrls: ['./update-user.component.scss'],
  templateUrl: './update-user.component.html',
})
export class UpdateUserComponent implements OnInit {

  public companyId: string = '';
  public model: User;
  public userId!: string;
  public page = 1;
  public searchText = '';
  public pages: number | any;
  public pageSize = 10;
  public branches: Branch[] = [];
  public brForm: FormControl = new FormControl();
  public branchesList: Branch[] = [];
  public removable = true;
  public busy: boolean = false;
  public userRoles: Role[] = [];
  public claims: any;
  public form = new FormGroup({
    branches: new FormControl(null, [Validators.required]),
  });

  constructor(
    private storageService: StorageService,
    private branchService: BranchService,
    private toastService: ToastService,
    private messageService: MessageService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
  ) {
    this.model = this.storageService.getData('data');
  }

  public ngOnInit() {
    this.branches = [];
    this.branchesList = [];
    this.claims = this.authService.userClaims;
    this.userId = this.authService.userId;
    this.companyId = this.storageService.getCompanyId;
    if (this.claims.doceipt_user_isOwner) {
      this.searchBranch();
      this.getUserRoles(this.companyId, this.model.id);
    }
  }

  public searchBranch() {
    this.busy = true;
    let matched = 0;
    this.branchService.getAll(this.companyId, this.page, this.pageSize)
      .then((result) => {
        if (this.model.branches) {
          for (const data of result) {
            for (const branch of this.model.branches) {
              if (data.id === branch.id) {
                matched = 1;
              }
            }
            if (matched === 0) {
              this.branches.push(data);
            } else {
              matched = 0;
            }
          }
        } else {
          this.branches = result;
        }
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

  public getAllUserRoles(companyId: string, userId: string): Promise<any> {
    return this.userService.getUserRoles(companyId, userId).toPromise();
  }

  public getUserRoles(companyId: string, userId: string) {
    this.busy = true;
    this.getAllUserRoles(companyId, userId)
      .then((result) => {
        this.userRoles = result;
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

  public goBack() {
    this.router.navigate(['/protected/company/manage-org']);
  }

  get getBranches() {
    return this.form.get('branches');
  }

  get getBranchText() {
    const br = this.getBranches;
    return br!.value ? br!.value[0].name : '';
  }

  get getBranchConcat() {
    const br = this.getBranches;
    return `+${br!.value.length - 1} ${br!.value.length === 2 ? 'other' : 'others'}`;
  }

  public getUser(id: string): Promise<any> {
    return this.userService.get(id).toPromise();
  }

  public addUserBranch(brancheIds: any[]): Promise<any> {
    return this.userService.assignBranches(this.model.id, this.companyId, brancheIds).toPromise();
  }

  public save() {
    this.busy = true;
    let branches = [];
    branches = this.form.get('branches')!.value;
    if (!branches) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }
    let branchIds = [];
    for (let i = 0; i < branches.length; i++) {
      branchIds.push(branches[i].id);
    }
    this.addUserBranch(branchIds).then((res) => {
      this.getUser(this.model.id).then((result) => {
        this.model = result;
        this.branches = [];
        this.searchBranch();
      }, (reject) => {
        this.toastService.error(reject);
      })
        .catch((error) => {
          this.toastService.error(error);
        })
        .finally(() => {
          this.busy = false;
        });
      this.toastService.success(this.messageService.operationSuccesful);
      this.form.markAsUntouched();
      branches = [];
      branchIds = [];
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

  public deleteUserBranch(id: string): Promise<any> {
    return this.userService.deleteBranch(this.model.id, this.companyId, id).toPromise();
  }

  public getDeleteDialog(element: Branch, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: element.id,
        message: `Are you sure you want to ${action} <b>${this.model.name}</b> from <br>
        <b>${element.name}</b>?`,
      },
      width: '450px',
    });
  }

  public openDeleteDialog(element: Branch) {
    const dialogRef = this.getDeleteDialog(element, 'remove');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busy = true;
        this.deleteUserBranch(result)
          .then(() => {
            this.getUser(this.model.id).then((res) => {
              this.model = res;
              this.branches = [];
              this.searchBranch();
            }, (reject) => {
              this.toastService.error(reject);
            })
              .catch((error) => {
                this.toastService.error(error);
              })
              .finally(() => {
                this.busy = false;
              });
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
    });
  }

  public addPrincipalOwner(user: UserUpdate): Promise<any> {
    return this.userService.addPrincipalOwner(user).toPromise();
  }

  public addRemoveOwner(user: UserUpdate,): Promise<any> {
    return this.userService.addOwner(user).toPromise();
  }

  public getConfirmationDialog(element: User) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: element.id,
        message: `Are you sure you want to transfer principal ownership to <b>${this.model.name}</b>?<br>
        <b>Warning: </b> this action is not reversible and Doceipt will log you out automatically`,
      },
      width: '450px',
    });
  }

  public openConfirmationDialog(element: User) {
    const dialogRef = this.getConfirmationDialog(element);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busy = true;
        let userUpdate = new UserUpdate();
        userUpdate.companyId = this.companyId;
        userUpdate.userId = result;
        userUpdate.isPrincipalOwner = true;
        this.addPrincipalOwner(userUpdate)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            setTimeout(() => {
              this.signout();
            }, 3000);
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
    });
  }

  public getDialog(element: User, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: element.id,
        message: `Are you sure you want to ${action} <b>${this.model.name}</b> as owner?<br>`,
      },
      width: '450px',
    });
  }

  public openDialog(element: User, action: string) {
    const dialogRef = this.getDialog(element, action);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busy = true;
        let userUpdate = new UserUpdate();
        userUpdate.companyId = this.companyId;
        userUpdate.userId = result;
        if (action == 'add') {
          userUpdate.isOwner = true;
        }
        if (action == 'remove') {
          userUpdate.isOwner = false;
        }
        this.addRemoveOwner(userUpdate)
          .then(() => {
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
    });
  }

  signout() {
    this.authService.signout();
  }

}

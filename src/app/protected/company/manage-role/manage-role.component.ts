import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { RoleService } from '../role.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Role } from 'src/app/models/role.model';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss']
})

export class ManageRoleComponent implements OnInit, OnDestroy {

  companyId: string = '';
  roles: Role[] = [];
  subscription: Subscription;
  busy: boolean = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private location: Location,
    private roleService: RoleService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private messageService: MessageService,
  ) {

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.router.navigate(['/protected/company/manage-org']);
        }
      });
  }

  ngOnInit() {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.loadRoles();
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goEditRole(arg: Role) {
    this.storageService.setData('data', arg);
    this.router.navigate(['protected/company/manage-role/edit-role']);
  }

  delete(id: string): Promise<any> {
    return this.roleService.delete(id).toPromise();
  }

  getDeleteDialog(element: Role, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the Role<br>
        <b>${element.name}</b>?`,
        input: element.id,
      },
    });
  }

  openDeleteDialog(element: Role, index: number) {
    const dialogRef = this.getDeleteDialog(element, 'delete');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busy = true;
        this.delete(result)
          .then(() => {
            this.roles.splice(index, 1);
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

  goBack() {
    // this.location.back();
    this.router.navigate(['/protected/company/manage-org']);
  }

  goAddRole() {
    this.router.navigate(['/protected/company/manage-role/add-role']);
  }

}

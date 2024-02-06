import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { BroadcastService } from 'src/app/providers/broadcast.service';
import { MessageService } from 'src/app/providers/message.service';
import { StorageService } from 'src/app/providers/storage.service';
import { UserInviteService } from '../user-invite.service';
import { UserService } from '../user.service';
import { ToastService } from 'src/app/providers/toast.service';
import { AuthService } from 'src/app/core/authentication/auth.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { UserInvite } from 'src/app/models/user-invite.model';
import { User } from 'src/app/models/user.model';
import { Connector } from 'src/app/models/connector.model';

import { UserInviteComponent } from '../user-invite/user-invite.component';
import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-org',
  templateUrl: './manage-org.component.html',
  styleUrls: ['./manage-org.component.scss']
})

export class ManageOrgComponent implements OnInit, OnDestroy {

  companyId: string = '';
  userId!: string;
  invites: UserInvite[] = [];
  users: User[] = [];
  subscription: Subscription;
  index: number | any;
  claims: any;
  pageSize = 10;
  busy: boolean = false;
  page = 1;
  pageSizeOptions: number[] = [5, 10, 25];
  searchText = '';
  connectors: Connector[] = [];

  constructor(
    private router: Router,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    private storageService: StorageService,
    private userInviteService: UserInviteService,
    private userService: UserService,
    private toastService: ToastService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) {
    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.initialize();
        } else if (message.sender === this.messageService.userInviteAddSender) {
          this.invites.push(message.data);
        }
      });
  }

  initialize() {
    this.companyId = this.storageService.getCompanyId;
    this.loadSentInvites();
    this.loadUsers();
  }

  public getSentInvites(companyId: string): Promise<any> {
    return this.userInviteService.getSentInvites(companyId).toPromise();
  }

  public loadSentInvites() {
    this.busy = true;
    this.getSentInvites(this.companyId).then((result) => {
      this.invites = result;
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

  public getAllUsers(companyId: string): Promise<any> {
    return this.userService.getUsers(companyId).toPromise();
  }

  public loadUsers() {
    this.busy = true;
    this.getAllUsers(this.companyId).then((result) => {
      this.users = result;
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

  ngOnInit() {
    this.initialize();
    this.claims = this.authService.userClaims;
    this.userId = this.authService.userId;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goRole() {
    this.router.navigate(['/protected/company/manage-role']);
  }

  goUpdateUser(user: any) {
    this.storageService.setData('data', user);
    this.router.navigate(['/protected/company/manage-org/update-user']);
  }

  openInviteDeleteDialog(index: number, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the invite for <b>${this.invites[index].username}</b>?`,
        input: this.invites[index].id
      },
    });
  }

  public deleteInvite(id: string): Promise<any> {
    return this.userInviteService.delete(id).toPromise();
  }

  inviteDeleteDialog(index: any) {
    const dialogRef = this.openInviteDeleteDialog(index, 'delete');
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busy = true;
        this.deleteInvite(result)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            this.invites.splice(index, 1);
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

  getDeleteOrVoidDialog(index: number) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to delete the user <b>${this.users[index].name}</b> from this company?`,
        input: this.users[index].id
      },
    });
  }

  public deleteUser(id: string, companyId: string): Promise<any> {
    return this.userService.delete(id, companyId).toPromise();
  }

  userDeleteDialog(index: any) {
    const dialogRef = this.getDeleteOrVoidDialog(index);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busy = true;
        this.deleteUser(result, this.companyId)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            this.users.splice(index, 1);
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

  openDialog(): void {
    const dialogRef = this.dialog.open(UserInviteComponent, {
      width: '450px',
      data: { show: true },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      // dialog closed
    });
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

  goBack() {
    this.router.navigate(['/protected/company'], { queryParams: { id: this.companyId } });
  }

}

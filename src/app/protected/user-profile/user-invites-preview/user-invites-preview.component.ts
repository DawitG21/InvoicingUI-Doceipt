import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { UserInviteService } from '../../company/user-invite.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { UserInvite } from 'src/app/models/user-invite.model';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogConfirmData } from 'src/app/interfaces/dialog-confirm-data';

declare var $: any;

@Component({
  selector: 'app-user-invites-preview',
  templateUrl: './user-invites-preview.component.html',
  styleUrls: ['./user-invites-preview.component.scss']
})
export class UserInvitesPreviewComponent implements OnInit, OnDestroy {
  index: number = 0;
  invites: UserInvite[] = [];
  isAcceptedInvite: boolean = false;
  subscription: Subscription | any;
  busy: boolean = false;

  constructor(
    private userInviteService: UserInviteService,
    private toastService: ToastService,
    private messageService: MessageService,
    private broadcastService: BroadcastService,
    public dialogRef: MatDialogRef<UserInvitesPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData,
  ) {
  }

  ngOnInit() {
    if (this.data.message === this.messageService.userInviteExistSender) {
      this.invites = this.data.input;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  close() {
    this.broadcastService.broadcastTask(
      new BroadcastMessage(this.messageService.userIsAcceptedInviteSender, this.isAcceptedInvite));

    if (this.isAcceptedInvite === true) {
      this.dialogRef.close('done');
    } else {
      this.dialogRef.close('canceled');
    }
  }

  public accept(id: string): Promise<any> {
    return this.userInviteService.accept(id).toPromise();
  }

  acceptInvite(index: number) {
    this.busy = true;
    this.index = index;
    this.isAcceptedInvite = true;

    this.accept(this.invites[index].id).then((result) => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.broadcastService.broadcastTask(new BroadcastMessage(this.messageService.userInviteAcceptSender, result));
      this.broadcastService.broadcastTask(new BroadcastMessage(this.messageService.companyAddSender, result.company));
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

  declineInvite(index: number) {
    this.index = index;
    // TODO: api implementation does not exist hence this is just to simulate
    // this.toastService.success(this.messageService.operationSuccesful);
    // this.broadcastService.broadcastTask(new BroadcastMessage(this.messageService.userInviteDeclineSender,
    //   this.invites[index]));
    this.invites.splice(index, 1);
  }

}

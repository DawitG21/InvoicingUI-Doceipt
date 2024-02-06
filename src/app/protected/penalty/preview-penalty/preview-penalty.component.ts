import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Penalty } from 'src/app/models/penalty';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { MessageService } from 'src/app/providers/message.service';

export interface DialogData {
  show: boolean;
  message: Penalty;
}

@Component({
  selector: 'app-preview-penalty',
  templateUrl: './preview-penalty.component.html',
  styleUrls: ['./preview-penalty.component.scss']
})
export class PreviewPenaltyComponent implements OnInit {

  subscription: Subscription;
  penalty: Penalty | any;

  constructor(
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<PreviewPenaltyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.contactPreviewSender) {
          this.penalty = message.data;
        }
      });
  }

  ngOnInit(): void {
    this.penalty = this.data.message;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close(): void {
    this.dialogRef.close();
  }

}

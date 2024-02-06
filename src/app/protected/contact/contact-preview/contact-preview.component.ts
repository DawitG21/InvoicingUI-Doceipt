import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BroadcastService } from 'src/app/providers/broadcast.service';
import { MessageService } from 'src/app/providers/message.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Contact } from 'src/app/models/contact.model';

export interface DialogData {
  show: boolean;
  message: Contact;
}

@Component({
  selector: 'app-contact-preview',
  templateUrl: './contact-preview.component.html',
  styleUrls: ['./contact-preview.component.scss']
})

export class ContactPreviewComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  contact: Contact | any;

  constructor(
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<ContactPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.contactPreviewSender) {
          this.contact = message.data;
        }
      });
  }

  ngOnInit() {
    this.contact = this.data.message;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close(): void {
    this.dialogRef.close();
  }

}

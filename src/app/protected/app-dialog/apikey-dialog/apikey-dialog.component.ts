import { Component, OnInit, Inject } from '@angular/core';

import { DialogConfirmData } from 'src/app/interfaces/dialog-confirm-data';

import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';

@Component({
  selector: 'app-apikey-dialog',
  templateUrl: './apikey-dialog.component.html',
  styleUrls: ['./apikey-dialog.component.scss']
})
export class ApikeyDialogComponent implements OnInit {

  apiKey: string;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ApikeyDialogComponent>,
    private toastService: ToastService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData
  ) {
    this.apiKey = data.message;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  copyApiKey() {
    const copyText = document.getElementById('apikey') as HTMLInputElement;
    copyText.select();
    document.execCommand('copy');
    this.toastService.success(this.messageService.copiedMessage);
  }

}

import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  show: boolean;
}

@Component({
  selector: 'app-branch-preview',
  templateUrl: './branch-preview.component.html',
  styleUrls: ['./branch-preview.component.scss']
})

export class BranchPreviewComponent implements OnInit, OnDestroy {
  subscription: Subscription | any;
  model: any;

  constructor(
    public dialogRef: MatDialogRef<BranchPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.model = this.data;
    this.model.name = this.model.message.name;
    this.model.email = this.model.message.email;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  formatAddress() {
    let address = '';
    if (this.model.message.addressLine1) {
      address += `${this.model.message.addressLine1}<br>`;
    }
    if (this.model.message.addressLine2) {
      address += `${this.model.message.addressLine2}<br>`;
    }
    if (this.model.message.city) {
      address += `${this.model.message.city}<br>`;
    }
    if (this.model.message.state) {
      address += `${this.model.message.state}<br>`;
    }
    if (this.model.message.country) {
      address += `${this.model.message.country}`;
    }
    return address.trim();
  }

  close(): void {
    this.dialogRef.close();
  }

}

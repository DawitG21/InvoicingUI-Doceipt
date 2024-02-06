import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogConfirmData } from 'src/app/interfaces/dialog-confirm-data';

@Component({
  selector: 'app-add-service-dialog',
  styleUrls: ['./add-service-dialog.component.scss'],
  templateUrl: './add-service-dialog.component.html',
})
export class AddServiceDialogComponent implements OnInit {

  public serviceFees: any[];
  public selectedServices: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData,
  ) {
    this.serviceFees = data.input;
  }

  public ngOnInit(): void {
    this.selectedServices = [];
  }

  public onCheckChange(event: any, serviceFee: any) {
    for (const fee of this.serviceFees) {
      if (serviceFee.id === fee.id) {
        fee.checked = event.checked;
      }
    }
  }

}

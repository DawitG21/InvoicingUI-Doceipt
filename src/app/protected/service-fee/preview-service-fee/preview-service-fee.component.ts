import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { CustomerGroup } from 'src/app/models/customer-group.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';
import { Tax } from 'src/app/models/tax.model';

import { StorageService } from 'src/app/providers/storage.service';

export interface DialogData {
  show: boolean;
}

@Component({
  selector: 'app-preview-service-fee',
  templateUrl: './preview-service-fee.component.html',
  styleUrls: ['./preview-service-fee.component.scss']
})

export class PreviewServiceFeeComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'percentValue',
    'description',
  ];

  form = new FormGroup({
    'taxInclusive': new FormControl,
    'taxes': new FormControl,
  });

  dataSource = new MatTableDataSource<Tax>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  subscription: Subscription | any;
  paymentsGroup: CustomerGroup[] = [];
  paymentsCycle: PaymentCycle[] = [];
  taxes: Tax[] = [];
  model: any;
  busy: boolean = false;
  companyId: string = '';

  constructor(
    public dialogRef: MatDialogRef<PreviewServiceFeeComponent>,
    @Inject(MAT_DIALOG_DATA) public message: DialogData,

    private storageService: StorageService,
  ) {
    this.model = this.message;
    this.dataSource = new MatTableDataSource<Tax>(this.model.message.taxes);
    this.form.get('taxes')!.setValue(this.model.message.taxes);
    this.model = this.message;
  }

  ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.form.get('taxes')!.setValue(this.model.message.taxes);
  }

}

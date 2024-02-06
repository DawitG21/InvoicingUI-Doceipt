import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceFeeRoutingModule } from './service-fee-routing.module';

import { IndexComponent } from './index/index.component';
import { CreateServiceFeeComponent } from './create-service-fee/create-service-fee.component';
import { UpdateServiceFeeComponent } from './update-service-fee/update-service-fee.component';
import { PreviewServiceFeeComponent } from './preview-service-fee/preview-service-fee.component';

import { ServiceFeeService } from './service-fee.service';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule } from '@angular/material/core';
import { CustomerGroupModule } from '../customer-group/customer-group.module';
import { AddTaxDialogComponent } from './add-tax-dialog/add-tax-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ServiceFeeGuard } from './service-fee.guard';

@NgModule({
  declarations: [
    IndexComponent,
    CreateServiceFeeComponent,
    UpdateServiceFeeComponent,
    PreviewServiceFeeComponent,
    AddTaxDialogComponent,
  ],
  entryComponents: [PreviewServiceFeeComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ServiceFeeRoutingModule,
    CustomerGroupModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatListModule,
    MatSelectModule,
    MatSortModule,
    MatDialogModule,
    MatRippleModule,
    MatTableModule,
    MatListModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatMenuModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule
  ],
  providers: [
    ServiceFeeService,
    ServiceFeeGuard,
  ],
})
export class ServiceFeeModule { }

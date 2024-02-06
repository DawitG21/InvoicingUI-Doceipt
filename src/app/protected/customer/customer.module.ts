import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AvatarModule } from 'ngx-avatar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CustomerRoutingModule } from './customer-routing.module';
import { ContactModule } from '../contact/contact.module';
import { CustomerGroupModule } from '../customer-group/customer-group.module';

import { IndexComponent } from './index/index.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { CustomerPreviewComponent } from './customer-preview/customer-preview.component';
import { CustomerSearchComponent } from './customer-search/customer-search.component';
import { CustomerSearchPageComponent } from './customer-search-page/customer-search-page.component';
import { AssignContactDialogComponent } from './assign-contact-dialog/assign-contact-dialog.component';
import { BillingAddressDialogComponent } from './billing-address-dialog/billing-address-dialog.component';

import { CustomerService } from './customer.service';
import { BillingAddressService } from './billing-address.service';

import { CustomerGuard } from './customer.guard';
import { InvoiceModule } from '../invoice/invoice.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  entryComponents: [
    CustomerPreviewComponent,
    AssignContactDialogComponent,
    CustomerSearchComponent,
  ],
  declarations: [
    IndexComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    CustomerPreviewComponent,
    CustomerSearchComponent,
    CustomerSearchPageComponent,
    AssignContactDialogComponent,
    BillingAddressDialogComponent,
  ],
  exports: [
    CustomerSearchComponent,
    CustomerPreviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    CustomerRoutingModule,
    ContactModule,
    AvatarModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatBadgeModule,
    CustomerGroupModule,
    MatCardModule,
    InvoiceModule,
  ],
  providers: [
    CustomerService,
    CustomerGuard,
    BillingAddressService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class CustomerModule { }

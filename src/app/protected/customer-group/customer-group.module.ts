import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'ngx-avatar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { CustomerGroupRoutingModule } from './customer-group-routing.module';

import { IndexComponent } from './index/index.component';
import { AddCustomerGroupComponent } from './add-customer-group/add-customer-group.component';
import { EditCustomerGroupComponent } from './edit-customer-group/edit-customer-group.component';
import { CustomerGroupSearchComponent } from './customer-group-search/customer-group-search.component';

import { CustomerGroupService } from './customer-group.service';

import { CustomerGroupGuard } from './customer-group.guard';

@NgModule({
  entryComponents: [
    CustomerGroupSearchComponent,
  ],
  declarations: [
    IndexComponent,
    AddCustomerGroupComponent,
    EditCustomerGroupComponent,
    CustomerGroupSearchComponent,
  ],
  exports: [
    CustomerGroupSearchComponent,
  ],
  imports: [
    CommonModule,
    CustomerGroupRoutingModule,
    FormsModule,
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
    MatSlideToggleModule,
    MatDialogModule,
    AvatarModule,
  ],
  providers: [
    CustomerGroupService,
    CustomerGroupGuard,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ]
})
export class CustomerGroupModule { }

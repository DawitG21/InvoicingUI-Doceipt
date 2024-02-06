import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { IndexComponent } from './index/index.component';
import { AddPaymentPolicyComponent } from './add-payment-policy/add-payment-policy.component';
import { EditPaymentPolicyComponent } from './edit-payment-policy/edit-payment-policy.component';

import { PaymentPolicyRoutingModule } from './payment-policy-routing.module';

import { PaymentPolicyService } from './payment-policy.service';
import { CustomerModule } from '../customer/customer.module';

import { PaymentPolicyGuard } from './payment-policy.guard';

@NgModule({
  declarations: [
    IndexComponent,
    AddPaymentPolicyComponent,
    EditPaymentPolicyComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaymentPolicyRoutingModule,
    CustomerModule,
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
    MatSelectModule,
  ],
  providers: [
    PaymentPolicyService,
    PaymentPolicyGuard,
  ],
})
export class PaymentPolicyModule { }

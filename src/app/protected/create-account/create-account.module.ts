import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateAccountRoutingModule } from './create-account-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { IndexComponent } from './index/index.component';
import { SetupCustomerGroupComponent } from './setup-customer-group/setup-customer-group.component';

import { CreateAccountService } from './create-account.service';

import { SetupPaymentCycleComponent } from './setup-payment-cycle/setup-payment-cycle.component';
import { SetupServiceComponent } from './setup-service/setup-service.component';
import { SetupServiceFeeComponent } from './setup-service-fee/setup-service-fee.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    IndexComponent,
    SetupCustomerGroupComponent,
    SetupPaymentCycleComponent,
    SetupServiceComponent,
    SetupServiceFeeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CreateAccountRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressBarModule,
  ],
  providers: [CreateAccountService],
})
export class CreateAccountModule { }

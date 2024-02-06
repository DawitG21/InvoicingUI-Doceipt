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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { PaymentCycleRoutingModule } from './payment-cycle-routing.module';

import { IndexComponent } from './index/index.component';
import { CreatePaymentCycleComponent } from './create-payment-cycle/create-payment-cycle.component';
import { UpdatePaymentCycleComponent } from './update-payment-cycle/update-payment-cycle.component';

import { PaymentCycleService } from './payment-cycle.service';

import { PaymentCycleGuard } from './payment-cycle.guard';

@NgModule({
  declarations: [
    IndexComponent,
    CreatePaymentCycleComponent,
    UpdatePaymentCycleComponent,
  ],
  imports: [
    CommonModule,
    PaymentCycleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  providers: [
    PaymentCycleService,
    PaymentCycleGuard,
  ],
})
export class PaymentCycleModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentMethodRoutingModule } from './payment-method-routing.module';

import { IndexComponent } from './index/index.component';

import { CreatePaymentMethodComponent } from './create-payment-method/create-payment-method.component';
import { UpdatePaymentMethodComponent } from './update-payment-method/update-payment-method.component';

import { PaymentMethodService } from './payment-method.service';

import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PaymentMethodGuard } from './payment-method.guard';

@NgModule({
  declarations: [
    IndexComponent,
    CreatePaymentMethodComponent,
    UpdatePaymentMethodComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PaymentMethodRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTableModule,
    MatListModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  providers: [
    PaymentMethodService,
    PaymentMethodGuard,
  ]
})
export class PaymentMethodModule { }

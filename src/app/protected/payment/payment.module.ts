import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { NgxPrintModule } from 'ngx-print';

import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentRoutingModule } from './payment-routing.module';
import { InvoiceModule } from '../invoice/invoice.module';

import { IndexComponent } from './index/index.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { ReceiptPreviewComponent } from './receipt-preview/receipt-preview.component';
import { ReceiptUpdatePromptComponent } from './receipt-update-prompt/receipt-update-prompt.component';
import { InvoiceSearchComponent } from '../invoice/invoice-search/invoice-search.component';

import { PaymentService } from './payment.service';

import { GroupByPipe } from 'src/app/filters/group-by.pipe';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatRippleModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    IndexComponent,
    CreatePaymentComponent,
    PaymentModalComponent,
    ReceiptPreviewComponent,
    ReceiptUpdatePromptComponent,
    GroupByPipe,
    InvoiceSearchComponent
  ],
  entryComponents: [
    InvoiceSearchComponent,
    PaymentModalComponent,
    ReceiptUpdatePromptComponent,
    ReceiptPreviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PaymentRoutingModule,
    AvatarModule,
    NgxPrintModule,
    InvoiceModule,
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
    MatDatepickerModule,
    MatAutocompleteModule
  ],
  providers: [
    PaymentService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ]
})
export class PaymentModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import { NgxPrintModule } from 'ngx-print';

import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { FilterUniquePipe } from 'src/app/filters/filter-unique-by.pipe';

import { IndexComponent } from './index/index.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { InvoiceSearchPageComponent } from './invoice-search-page/invoice-search-page.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { IndexInvoicePreviewComponent } from './index-invoice-preview/index-invoice-preview.component';
import { CustomerDueInvoiceComponent } from './customer-dueInvoice/customer-dueInvoice.component';

import { InvoiceService } from './invoice.service';
import { InvoiceCalculationsService } from './invoice-calculatons.service';
// import { CustomerModule } from '../customer/customer.module';
import { AddServiceDialogComponent } from './add-service-dialog/add-service-dialog.component';
import { InvoiceCarouselComponent } from './invoice-carousel/invoice-carousel.component';

@NgModule({
  entryComponents: [
    IndexInvoicePreviewComponent,
    CustomerDueInvoiceComponent,
    InvoicePreviewComponent,
  ],
  declarations: [
    IndexComponent,
    AddInvoiceComponent,
    InvoicePreviewComponent,
    IndexInvoicePreviewComponent,
    InvoiceSearchPageComponent,
    CustomerDueInvoiceComponent,
    AddServiceDialogComponent,
    InvoiceCarouselComponent,
    FilterUniquePipe,
  ],
  exports: [
    InvoicePreviewComponent,
    IndexInvoicePreviewComponent,
    CustomerDueInvoiceComponent,
    InvoiceCarouselComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InvoiceRoutingModule,
    // CustomerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTableModule,
    MatListModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    AvatarModule,
    NgxPrintModule,
  ],
  providers: [
    InvoiceService,
    InvoiceCalculationsService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class InvoiceModule { }

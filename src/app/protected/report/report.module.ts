import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { 
  PdfViewerModule,
  MagnificationService,
  NavigationService,
  PrintService,
} from '@syncfusion/ej2-angular-pdfviewer';


import { ReportRoutingModule } from './report.routing-module';
import { IndexComponent } from './index/index.component';
import { ReportService } from './report.service';
import { CustomerModule } from '../customer/customer.module';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PdfViewerModule,
    ToolbarModule,
    ReportRoutingModule,
    CustomerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRippleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatInputModule,
    MatProgressBarModule,
    MatAutocompleteModule
  ],
  providers: [
    ReportService,
    MagnificationService,
    NavigationService,
    PrintService,
    // MatDatepickerModule,
  ]
})
export class ReportModule { }

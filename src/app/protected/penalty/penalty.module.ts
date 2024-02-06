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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';

import { PenaltyRoutingModule } from './penalty-routing.module';
import { IndexComponent } from './index/index.component';
import { PenaltyService } from './penalty.service';
import { AddPenaltyComponent } from './add-penalty/add-penalty.component';
import { FinancialPeriodService } from '../financial-period/financial-period.service';
import { PreviewPenaltyComponent } from './preview-penalty/preview-penalty.component';



@NgModule({
  entryComponents: [
    PreviewPenaltyComponent,
  ],
  declarations: [
    IndexComponent,
    AddPenaltyComponent,
    PreviewPenaltyComponent
  ],
  imports: [
    CommonModule,
    PenaltyRoutingModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatTooltipModule
  ],
  providers: [
    PenaltyService,
    FinancialPeriodService
  ],
})
export class PenaltyModule { }

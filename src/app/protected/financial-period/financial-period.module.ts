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

import { FinancialPeriodRoutingModule } from './financial-period-routing.module';

import { IndexComponent } from './index/index.component';
import { AddFinancialPeriodComponent } from './add-financial-period/add-financial-period.component';
import { EditFinancialPeriodComponent } from './edit-financial-period/edit-financial-period.component';

import { FinancialPeriodService } from './financial-period.service';

import { FinancialPeriodGuard } from './financial-period.guard';

@NgModule({
  declarations: [
    IndexComponent,
    AddFinancialPeriodComponent,
    EditFinancialPeriodComponent,
  ],
  imports: [
    CommonModule,
    FinancialPeriodRoutingModule,
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
  ],
  providers: [
    FinancialPeriodService,
    FinancialPeriodGuard,
  ],
})
export class FinancialPeriodModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { IndexComponent } from './index/index.component';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  ChartModule,
//   CategoryService,
//   DateTimeService,
//   ScrollBarService,
//   ColumnSeriesService,
//   LineSeriesService,
//   ChartAnnotationService,
//   RangeColumnSeriesService,
//   StackingColumnSeriesService,
//   LegendService,
//   TooltipService
} from '@syncfusion/ej2-angular-charts';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ChartModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule
  ],
  providers: [
    // CategoryService,
    // DateTimeService,
    // ScrollBarService,
    // ColumnSeriesService,
    // LineSeriesService,
    // ChartAnnotationService,
    // RangeColumnSeriesService,
    // StackingColumnSeriesService,
    // LegendService,
    // TooltipService
  ]
})
export class DashboardModule { }

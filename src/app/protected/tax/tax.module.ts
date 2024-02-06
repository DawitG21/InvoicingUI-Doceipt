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

import { TaxRoutingModule } from './tax-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CreateTaxComponent } from './create-tax/create-tax.component';
import { IndexComponent } from './index/index.component';
import { UpdateTaxComponent } from './update-tax/update-tax.component';

import { TaxService } from './tax.service';

import { TaxGuard } from './tax.guard';

@NgModule({
  declarations: [
    CreateTaxComponent,
    IndexComponent,
    UpdateTaxComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TaxRoutingModule,
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
  ]
  ,
  providers: [
    TaxService,
    TaxGuard,
  ],
})
export class TaxModule { }

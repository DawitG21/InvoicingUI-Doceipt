import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceRoutingModule } from './service-routing.module';

import { IndexComponent } from './index/index.component';
import { CreateServiceComponent } from './create-service/create-service.component';
import { UpdateServiceComponent } from './update-service/update-service.component';
import { ServiceService } from './service.service';

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
import { MatSortModule } from '@angular/material/sort';

import { ServiceGuard } from './service.guard';

@NgModule({
  declarations: [
    IndexComponent,
    CreateServiceComponent,
    UpdateServiceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ServiceRoutingModule,
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
    ServiceService,
    ServiceGuard,
  ],
})
export class ServiceModule { }

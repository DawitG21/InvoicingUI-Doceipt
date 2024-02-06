import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { BranchRoutingModule } from './branch-routing.module';

import { BranchService } from './branch.service';

import { IndexComponent } from './index/index.component';
import { AddBranchComponent } from './add-branch/add-branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch.component';
import { BranchPreviewComponent } from './branch-preview/branch-preview.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { BranchGuardGuard } from './branch-guard.guard';

@NgModule({
  declarations: [
    IndexComponent,
    AddBranchComponent,
    EditBranchComponent,
    BranchPreviewComponent,
  ],
  entryComponents: [
    BranchPreviewComponent
  ],
  exports: [
    BranchPreviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxIntlTelInputModule,
    BranchRoutingModule,
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
  providers: [BranchService, BranchGuardGuard],
})
export class BranchModule { }

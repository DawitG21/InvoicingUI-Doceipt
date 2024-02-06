import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { ApikeyDialogComponent } from './apikey-dialog/apikey-dialog.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ImportDialogComponent,
    ApikeyDialogComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    ImportDialogComponent,
    ApikeyDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressBarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class AppDialogModule { }

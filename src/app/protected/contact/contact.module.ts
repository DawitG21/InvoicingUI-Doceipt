import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'ngx-avatar';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ContactRoutingModule } from './contact-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IndexComponent } from './index/index.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { ContactSearchComponent } from './contact-search/contact-search.component';
import { ContactPreviewComponent } from './contact-preview/contact-preview.component';

import { ContactService } from './contact.service';

import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
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
import { ContactSearchPageComponent } from './contact-search-page/contact-search-page.component';
import { ContactGuard } from './contact.guard';

@NgModule({
  entryComponents: [
    ContactPreviewComponent,
    ContactSearchComponent,
  ],
  declarations: [
    IndexComponent,
    AddContactComponent,
    EditContactComponent,
    ContactSearchComponent,
    ContactPreviewComponent,
    ContactSearchPageComponent,
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    FormsModule,
    AvatarModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    MatTableModule,
    MatListModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  exports: [
    ContactSearchComponent,
  ],
  providers: [
    ContactService,
    ContactGuard,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ]
})
export class ContactModule { }

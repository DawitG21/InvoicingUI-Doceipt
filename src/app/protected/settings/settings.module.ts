import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';

import { IndexComponent } from './index/index.component';
import { AddSourceComponent } from './add-source/add-source.component';
import { EditSourceComponent } from './edit-source/edit-source.component';
import { AddConnectorComponent } from './add-connector/add-connector.component';
import { EditConnectorComponent } from './edit-connector/edit-connector.component';

import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ConnectorService } from './connector.service';
import { SettingsService } from './settings.service';
import { SourceService } from './source.service';

import { ConnectorGuard } from './connector.guard';
import { SourceGuard } from './source.guard';

@NgModule({
  declarations: [
    IndexComponent,
    AddSourceComponent,
    EditSourceComponent,
    AddConnectorComponent,
    EditConnectorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    MatAutocompleteModule,
  ],
  providers: [
    ConnectorService,
    SettingsService,
    SourceService,
    ConnectorGuard,
    SourceGuard,
  ],
})
export class SettingsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { ProtectedRoutingModule } from './protected.routing-module';

import { IndexComponent } from './index/index.component';

import { ProtectedService } from './protected.service';
import { AppDialogModule } from './app-dialog/app-dialog.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProtectedRoutingModule,
    SharedModule,
    AppDialogModule,
    UserProfileModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  providers: [
    ProtectedService,
  ]
})
export class ProtectedModule { }

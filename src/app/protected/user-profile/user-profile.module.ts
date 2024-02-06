import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { UserProfileRoutingModule } from './user-profile.routing-module';

import { IndexComponent } from './index/index.component';
import { UserInvitesPreviewComponent } from './user-invites-preview/user-invites-preview.component';

@NgModule({
  declarations: [
    IndexComponent,
    UserInvitesPreviewComponent,
  ],
  entryComponents: [
    UserInvitesPreviewComponent,
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
})
export class UserProfileModule { }

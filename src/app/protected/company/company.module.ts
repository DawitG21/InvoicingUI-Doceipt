import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyRoutingModule } from './company.routing-module';
import { AvatarModule } from 'ngx-avatar';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { CompanyDetailService } from './company-detail.service';
import { CompanyService } from './company.service';
import { RoleService } from './role.service';
import { TemplateService } from './template.service';

import { AddCompanyComponent } from './add-company/add-company.component';
import { IndexComponent } from './index/index.component';
import { AddCompanyDetailComponent } from './add-company-detail/add-company-detail.component';
import { EditCompanyDetailComponent } from './edit-company-detail/edit-company-detail.component';
import { AddMachineComponent } from './add-machine/add-machine.component';
import { EditMachineComponent } from './edit-machine/edit-machine.component';
import { ManageOrgComponent } from './manage-org/manage-org.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { UserInviteComponent } from './user-invite/user-invite.component';
import { UpdateUserComponent } from './update-user/update-user.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

import { AddRoleComponent } from './add-role/add-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

import { CompanyDetailGuardGuard } from './company-detail-guard.guard';
import { MachineGuard } from './machine.guard';
import { RoleGuard } from './role.guard';
import { UserGuard } from './user.guard';

@NgModule({
  declarations: [
    IndexComponent,
    AddCompanyComponent,
    AddCompanyDetailComponent,
    EditCompanyDetailComponent,
    AddMachineComponent,
    EditMachineComponent,
    ManageOrgComponent,
    ManageRoleComponent,
    UserInviteComponent,
    UpdateUserComponent,
    AddRoleComponent,
    EditRoleComponent,
  ],
  entryComponents: [
    UserInviteComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxIntlTelInputModule,
    CompanyRoutingModule,
    AvatarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTableModule,
    MatListModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTabsModule,
    MatRadioModule,
  ],
  providers: [
    CompanyService,
    CompanyDetailService,
    RoleService,
    TemplateService,
    CompanyDetailGuardGuard,
    MachineGuard,
    RoleGuard,
    UserGuard,
  ],
})
export class CompanyModule { }

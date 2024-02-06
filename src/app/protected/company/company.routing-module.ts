import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from 'src/app/shell/shell.service';

import { IndexComponent } from './index/index.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { AddCompanyDetailComponent } from './add-company-detail/add-company-detail.component';
import { EditCompanyDetailComponent } from './edit-company-detail/edit-company-detail.component';
import { AddMachineComponent } from './add-machine/add-machine.component';
import { EditMachineComponent } from './edit-machine/edit-machine.component';
import { ManageOrgComponent } from './manage-org/manage-org.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

import { CompanyDetailGuardGuard } from './company-detail-guard.guard';
import { MachineGuard } from './machine.guard';
import { RoleGuard } from './role.guard';
import { UserGuard } from './user.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: AddCompanyComponent },
    { path: 'add-detail', component: AddCompanyDetailComponent },
    { path: 'edit-detail', component: EditCompanyDetailComponent, canDeactivate: [CompanyDetailGuardGuard] },
    { path: 'add-machine', component: AddMachineComponent },
    { path: 'edit-machine', component: EditMachineComponent, canDeactivate: [MachineGuard] },
    { path: 'manage-org', component: ManageOrgComponent },
    { path: 'manage-role', component: ManageRoleComponent },
    { path: 'manage-role/add-role', component: AddRoleComponent },
    { path: 'manage-role/edit-role', component: EditRoleComponent, canDeactivate: [RoleGuard] },
    { path: 'manage-org/update-user', component: UpdateUserComponent, canDeactivate: [UserGuard] },
  ]),
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CompanyRoutingModule { }

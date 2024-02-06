import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from 'src/app/shell/shell.service';
import { IndexComponent } from './index/index.component';
import { AddBranchComponent } from './add-branch/add-branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch.component';

import { BranchGuardGuard } from './branch-guard.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: AddBranchComponent },
    { path: 'edit', component: EditBranchComponent, canDeactivate: [BranchGuardGuard] },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }

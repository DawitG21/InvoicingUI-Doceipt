import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';

import { IndexComponent } from './index/index.component';
import { AddCustomerGroupComponent } from './add-customer-group/add-customer-group.component';
import { EditCustomerGroupComponent } from './edit-customer-group/edit-customer-group.component';

import { CustomerGroupGuard } from './customer-group.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: AddCustomerGroupComponent },
    { path: 'edit', component: EditCustomerGroupComponent, canDeactivate: [CustomerGroupGuard] },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerGroupRoutingModule { }

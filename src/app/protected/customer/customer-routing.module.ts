import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';

import { IndexComponent } from './index/index.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { CustomerSearchPageComponent } from './customer-search-page/customer-search-page.component';

import { CustomerGuard } from './customer.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: AddCustomerComponent },
    { path: 'edit', component: EditCustomerComponent, canDeactivate: [CustomerGuard] },
    { path: 'search', component: CustomerSearchPageComponent },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule { }

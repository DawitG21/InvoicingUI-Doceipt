import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';

import { IndexComponent } from './index/index.component';
import { SetupCustomerGroupComponent } from './setup-customer-group/setup-customer-group.component';
import { SetupPaymentCycleComponent } from './setup-payment-cycle/setup-payment-cycle.component';
import { SetupServiceComponent } from './setup-service/setup-service.component';
import { SetupServiceFeeComponent } from './setup-service-fee/setup-service-fee.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'setup-customer-group', component: SetupCustomerGroupComponent },
    { path: 'setup-payment-cycle', component: SetupPaymentCycleComponent },
    { path: 'setup-service', component: SetupServiceComponent },
    { path: 'setup-service-fee', component: SetupServiceFeeComponent },
  ]),
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class CreateAccountRoutingModule { }

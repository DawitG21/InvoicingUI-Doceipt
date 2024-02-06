import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';
import { IndexComponent } from './index/index.component';
import { AddPaymentPolicyComponent } from './add-payment-policy/add-payment-policy.component';
import { EditPaymentPolicyComponent } from './edit-payment-policy/edit-payment-policy.component';

import { PaymentPolicyGuard } from './payment-policy.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: AddPaymentPolicyComponent },
    { path: 'edit', component: EditPaymentPolicyComponent, canDeactivate: [PaymentPolicyGuard] },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentPolicyRoutingModule { }

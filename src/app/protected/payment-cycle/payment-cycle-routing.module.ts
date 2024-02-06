import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';

import { IndexComponent } from './index/index.component';
import { CreatePaymentCycleComponent } from './create-payment-cycle/create-payment-cycle.component';
import { UpdatePaymentCycleComponent } from './update-payment-cycle/update-payment-cycle.component';

import { PaymentCycleGuard } from './payment-cycle.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: CreatePaymentCycleComponent },
    { path: 'edit', component: UpdatePaymentCycleComponent, canDeactivate: [PaymentCycleGuard] },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentCycleRoutingModule { }

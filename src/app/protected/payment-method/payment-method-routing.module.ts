import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';

import { IndexComponent } from './index/index.component';
import { CreatePaymentMethodComponent } from './create-payment-method/create-payment-method.component';
import { UpdatePaymentMethodComponent } from './update-payment-method/update-payment-method.component';

import { PaymentMethodGuard } from './payment-method.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: CreatePaymentMethodComponent },
    { path: 'edit', component: UpdatePaymentMethodComponent, canDeactivate: [PaymentMethodGuard] },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodRoutingModule { }


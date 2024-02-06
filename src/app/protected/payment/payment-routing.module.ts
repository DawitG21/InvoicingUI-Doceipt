import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';

import { IndexComponent } from './index/index.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';


const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: CreatePaymentComponent },
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }

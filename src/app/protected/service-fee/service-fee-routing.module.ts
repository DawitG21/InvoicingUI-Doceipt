import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';
import { IndexComponent } from './index/index.component';
import { CreateServiceFeeComponent } from './create-service-fee/create-service-fee.component';
import { UpdateServiceFeeComponent } from './update-service-fee/update-service-fee.component';

import { ServiceFeeGuard } from './service-fee.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: CreateServiceFeeComponent },
    { path: 'edit', component: UpdateServiceFeeComponent,canDeactivate: [ServiceFeeGuard] },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceFeeRoutingModule { }

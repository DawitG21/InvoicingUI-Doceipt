import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';

import { IndexComponent } from './index/index.component';
import { AddFinancialPeriodComponent } from './add-financial-period/add-financial-period.component';
import { EditFinancialPeriodComponent } from './edit-financial-period/edit-financial-period.component';

import { FinancialPeriodGuard } from './financial-period.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: AddFinancialPeriodComponent },
    { path: 'edit', component: EditFinancialPeriodComponent, canDeactivate: [FinancialPeriodGuard] },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialPeriodRoutingModule { }

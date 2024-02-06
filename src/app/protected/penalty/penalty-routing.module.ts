import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from 'src/app/shell/shell.service';
import { AddPenaltyComponent } from './add-penalty/add-penalty.component';
import { IndexComponent } from './index/index.component';


const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: AddPenaltyComponent },
    // { path: 'edit', component: EditFinancialPeriodComponent, canDeactivate: [FinancialPeriodGuard] },
  ]),
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PenaltyRoutingModule { }

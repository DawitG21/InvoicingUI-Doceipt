import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';
import { IndexComponent } from './index/index.component';
import { CreateTaxComponent } from './create-tax/create-tax.component';
import { UpdateTaxComponent } from './update-tax/update-tax.component';

import { TaxGuard } from './tax.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: CreateTaxComponent },
    { path: 'edit', component: UpdateTaxComponent, canDeactivate: [TaxGuard] },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxRoutingModule { }

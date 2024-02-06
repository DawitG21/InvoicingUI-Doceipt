import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';

import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { IndexComponent } from './index/index.component';
import { InvoiceSearchPageComponent } from './invoice-search-page/invoice-search-page.component';


const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: AddInvoiceComponent },
    { path: 'search', component: InvoiceSearchPageComponent },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }

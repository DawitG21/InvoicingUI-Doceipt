import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from 'src/app/shell/shell.service';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
  ])
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ReportRoutingModule { }

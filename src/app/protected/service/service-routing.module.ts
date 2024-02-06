import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from 'src/app/shell/shell.service';
import { IndexComponent } from './index/index.component';
import { CreateServiceComponent } from './create-service/create-service.component';
import { UpdateServiceComponent } from './update-service/update-service.component';

import { ServiceGuard } from './service.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: CreateServiceComponent },
    { path: 'edit', component: UpdateServiceComponent, canDeactivate: [ServiceGuard] },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }

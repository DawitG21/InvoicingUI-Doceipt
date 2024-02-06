import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from 'src/app/shell/shell.service';

import { IndexComponent } from './index/index.component';
import { AddSourceComponent } from './add-source/add-source.component';
import { EditSourceComponent } from './edit-source/edit-source.component';
import { AddConnectorComponent } from './add-connector/add-connector.component';
import { EditConnectorComponent } from './edit-connector/edit-connector.component';

import { ConnectorGuard } from './connector.guard';
import { SourceGuard } from './source.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add-source', component: AddSourceComponent },
    { path: 'edit-source', component: EditSourceComponent, canDeactivate: [SourceGuard] },
    { path: 'add-connector', component: AddConnectorComponent },
    { path: 'update-connector', component: EditConnectorComponent, canDeactivate: [ConnectorGuard] },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SettingsRoutingModule { }

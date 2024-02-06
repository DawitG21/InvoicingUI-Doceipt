import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Shell } from '../shell/shell.service';
import { IndexComponent } from './index/index.component';
import { SignUpComponent } from './sign-up/sign-up.component';


const routes: Routes = [
  Shell.childRoutes([
    { path: '', pathMatch: 'full', component: IndexComponent },
    { path: 'signup', component: SignUpComponent }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule { }

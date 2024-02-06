import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { AccountRoutingModule } from './account.routing-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AccountRoutingModule,
    SharedModule
  ],
  declarations: [LoginComponent]
})
export class AccountModule { }

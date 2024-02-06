import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { IndexComponent } from './index/index.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [IndexComponent, SignUpComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
  ],
  providers: [
  ],
})
export class HomeModule { }

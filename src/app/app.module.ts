import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrModule } from 'ngx-toastr';

import { AccountModule } from './account/account.module';
import { ErrorsModule } from './errors/errors.module';
import { HomeModule } from './home/home.module';
import { ProtectedModule } from './protected/protected.module';
import { SharedModule } from './shared/shared.module';
import { ShellModule } from './shell/shell.module';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { CustomerModule } from './protected/customer/customer.module';
import { PenaltyModule } from './protected/penalty/penalty.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthCallbackComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    Ng2SearchPipeModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HomeModule,
    AccountModule,
    ProtectedModule,
    ErrorsModule,
    AppRoutingModule,
    ShellModule,
    CoreModule,
    SharedModule,
    CustomerModule,
    PenaltyModule,
  ],

  providers: [
    DatePipe
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }

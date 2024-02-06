import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/authentication/auth.guard';
import { Shell } from '../shell/shell.service';

import { IndexComponent } from './index/index.component';

const children: Routes = [
    {
        path: 'batch-invoice',
        loadChildren: () => import('./batch-invoice/batch-invoice.module').then(m => m.BatchInvoiceModule)
    },
    {
        path: 'branch',
        loadChildren: () => import('./branch/branch.module').then(m => m.BranchModule)
    },
    {
        path: 'company',
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
    },
    {
        path: 'contact',
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
    },
    {
        path: 'create-account',
        loadChildren: () => import('./create-account/create-account.module').then(m => m.CreateAccountModule)
    },
    {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
    },
    {
        path: 'customer-group',
        loadChildren: () => import('./customer-group/customer-group.module').then(m => m.CustomerGroupModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'financial-period',
        loadChildren: () => import('./financial-period/financial-period.module').then(m => m.FinancialPeriodModule)
    },
    {
        path: 'invoice',
        loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule)
    },
    {
        path: 'payment',
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
    },
    {
        path: 'payment-cycle',
        loadChildren: () => import('./payment-cycle/payment-cycle.module').then(m => m.PaymentCycleModule)
    },
    {
        path: 'payment-method',
        loadChildren: () => import('./payment-method/payment-method.module').then(m => m.PaymentMethodModule)
    },
    {
        path: 'payment-policy',
        loadChildren: () => import('./payment-policy/payment-policy.module').then(m => m.PaymentPolicyModule)
    },
    {
        path: 'penalty',
        loadChildren: () => import('./penalty/penalty.module').then(m => m.PenaltyModule)
    },
    {
        path: 'report',
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
    },
    {
        path: 'service',
        loadChildren: () => import('./service/service.module').then(m => m.ServiceModule)
    },
    {
        path: 'service-fee',
        loadChildren: () => import('./service-fee/service-fee.module').then(m => m.ServiceFeeModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
    },
    {
        path: 'tax',
        loadChildren: () => import('./tax/tax.module').then(m => m.TaxModule)
    },
];

const routes: Routes = [
    Shell.childRoutes([
        { path: 'protected', component: IndexComponent, canActivate: [AuthGuard], children: children }
    ])
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class ProtectedRoutingModule { }

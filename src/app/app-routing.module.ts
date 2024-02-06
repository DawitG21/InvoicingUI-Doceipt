import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';

const routes: Routes = [
    { path: 'auth-callback', component: AuthCallbackComponent },

    // Fallback when no prior route is matched
    { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
    { path: 'page-not-found', component: PageNotFoundComponent }
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }

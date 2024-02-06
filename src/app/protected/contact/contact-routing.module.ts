import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from 'src/app/shell/shell.service';
import { IndexComponent } from './index/index.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ContactSearchPageComponent } from './contact-search-page/contact-search-page.component';
import { ContactGuard } from './contact.guard';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', component: IndexComponent },
    { path: 'add', component: AddContactComponent },
    { path: 'edit', component: EditContactComponent, canDeactivate: [ContactGuard] },
    { path: 'search', component: ContactSearchPageComponent },
  ]),
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class ContactRoutingModule { }

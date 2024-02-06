import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { SpinnerService } from 'src/app/providers/spinner.service';
import { CompanyService } from '../company/company.service';
import { UserInviteService } from '../company/user-invite.service';
import { ConsoleService } from 'src/app/providers/console.service';
import { ToastService } from 'src/app/providers/toast.service';

import { Company } from 'src/app/models/company.model';
import { UserInvite } from 'src/app/models/user-invite.model';

import { MatDialog } from '@angular/material/dialog';

import { UserInvitesPreviewComponent } from '../user-profile/user-invites-preview/user-invites-preview.component';
import { ImportStatus } from 'src/app/models/import-status.model';
import { CustomerService } from '../customer/customer.service';

declare var $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit, OnDestroy {

  claims: any;
  busy: boolean = false;
  showNavs: boolean = false;
  profilename: string = '';
  toggleStyle = 'sidebar-expanded';
  companySelected: Company | any;
  companies: Company[] = [];
  userInvites: UserInvite[] = [];
  accountStatus: any;
  subscription: Subscription;
  importStatus!: ImportStatus;
  progress: number | undefined;
  companyId: string = '';
  interval: any;

  constructor(
    private authService: AuthService,
    private protectedService: ProtectedService,
    private broadcastService: BroadcastService,
    private spinner: SpinnerService,
    private router: Router,
    private customerService: CustomerService,
    private companyService: CompanyService,
    private storageService: StorageService,
    private messageService: MessageService,
    private userInviteService: UserInviteService,
    private consoleService: ConsoleService,
    public dialog: MatDialog,
    private toastService: ToastService,
  ) {

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message && message.sender === 'show-navs') {
          this.showNavs = true;
          this.initActiveCompany();
        } else if (message && message.sender === this.messageService.companyAddSender) {
          this.companies.push(message.data);

        } else if (message && message.sender === this.messageService.companySwitchSender) {
          // company was switched
        } else if (message && message.sender === this.messageService.customerImportSender) {
          this.companyId = message.data;
          // get import stats
          this.importCustomerStatus(this.companyId)
            .then((result: ImportStatus) => {
              if (!result || result.isCompleted) {
                this.importCustomer();
              } else if (!result.isCompleted) {
                let message = new BroadcastMessage(this.messageService.importingInProgressSender);
                this.broadcastService.broadcastTask(message);

                this.startCustomerImportInterval();
              }
            }).catch((error) => { console.error(`import stats failed. ${error}`);});
        }
      });
  }

  ngOnInit() {
    this.companies = [];
    this.busy = true;
    this.spinner.show();

    this.profilename = this.authService.name;
    this.claims = this.authService.userClaims;
    this.redirect();
    this.initActiveCompany();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  startCustomerImportInterval() {
    this.interval = setInterval(() => {
      this.getImportCustomerStatus();
    }, 10000);
  }

  public importCustomerStatus(companyId: string): Promise<any> {
    return this.customerService.importStatus(companyId).toPromise();
  }


  public importCustomer() {
    this.customerService.import(this.companyId).toPromise()
      .then((res: any) => {
        this.startCustomerImportInterval();
      }).catch();
  }

  public getImportCustomerStatus(): void {

    this.importCustomerStatus(this.companyId)
      .then((result: ImportStatus) => {
        this.importStatus = result;

        // calculate only if result has data
        if (result) {
          this.calculateProgress();

          if (!this.importStatus.isSuccess && this.importStatus.isCompleted) {
            // cancel interval to stop checking for status
            clearInterval(this.interval);
            this.toastService.success(this.messageService.importCompletedWithErrors);
          }

          if (this.importStatus.isSuccess && this.importStatus.isCompleted) {
            // cancel interval to stop checking for status
            clearInterval(this.interval);
            this.broadcastService.broadcastTask(new BroadcastMessage(this.messageService.importCompleted));
            this.toastService.success(this.messageService.importCompleted);
          }
        }
        else {
          // cancel interval to stop checking for status
          clearInterval(this.interval);
          this.toastService.error(this.messageService.importNotStarted);
        }
      }, (reject) => {
        // cancel interval to stop checking for status
        clearInterval(this.interval);
        this.toastService.error(this.messageService.serverError);
      })
      .catch((error) => {
        // cancel interval to stop checking for status
        clearInterval(this.interval);
        this.toastService.error(this.messageService.serverError);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  public calculateProgress() {
    let pages = this.importStatus.rows / this.importStatus.pageSize;
    let progress = this.importStatus.page * 100 / pages;
    this.progress = parseFloat(progress.toFixed(2));
  }

  public getInvites(): Promise<any> {
    return this.userInviteService.getReceivedInvites().toPromise();
  }

  redirect() {
    this.protectedService.redirectUser(this.authService.authorizationHeaderValue)
      .pipe(finalize(() => {
        this.spinner.hide();
        this.busy = false;
      }))
      .subscribe(result => {
        this.accountStatus = result;
        this.getInvites().then((invites) => {
          this.userInvites = invites;
          this.broadcastService.broadcastTask(
            new BroadcastMessage(this.messageService.userInviteExistSender, invites));

          if (this.userInvites && this.userInvites.length > 0) {
            // display invites
            this.openInvitesDialog(invites);
          } else {
            this.redirectComplete();
          }
        }, (reject) => {
          this.toastService.error(reject);
        })
          .catch((error) => {
            this.toastService.error(error);
          })
          .finally(() => {
            this.busy = false;
          });
      });
  }

  public getInvitesDialog(invites: any) {
    return this.dialog.open(UserInvitesPreviewComponent, {
      data: {
        input: invites,
        message: this.messageService.userInviteExistSender,
      },
      width: '550px',
    });
  }

  public openInvitesDialog(invites: any) {

    const dialogRef = this.getInvitesDialog(invites);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'done') {
        // user accepted an invite
        this.showNavs = true;
        this.initActiveCompany();
        this.router.navigate(['/protected/dashboard']);
      } else {
        // the user did not accept any invite
        this.redirectComplete();
      }
    });
    dialogRef.disableClose = true;
  }

  redirectComplete() {
    const state = this.authService.state;

    // try signin
    if (state === undefined || state.from === 'signin') {
      switch (this.accountStatus.status) {
        // redirect to signup page
        case 'NEW_ACCOUNT':
          this.showNavs = false;
          this.toastService.error(this.messageService.NOT_INVITED);
          this.router.navigate(['/login']);
          // disabled by Usman to avoid creating company by anu user
          // this.router.navigate(['/signup']);
          break;

        // redirect to protected/dashboard
        default:
          this.showNavs = true;
          this.router.navigate(['/protected/dashboard']);
          break;
      }
    } else {
      // try signup
      switch (this.accountStatus.status) {
        // redirect to signup page
        case 'NEW_ACCOUNT':
          this.showNavs = false;
          this.router.navigate(['/protected/create-account']);
          break;

        // redirect to protected/dashboard
        default:
          this.showNavs = true;
          this.router.navigate(['/protected/dashboard']);
          break;
      }
    }
  }


  initActiveCompany() {
    this.companyService.getAll()
      .subscribe(result => {
        this.consoleService.consoleMessage(result);

        // check if result is null or empty
        // for users who are invited to a company
        // and not assigned to any company yet
        if (result === null || result.length === 0) {
          return;
        }

        if (result != null || result.length > 0) {
          this.companies = result;

          // check if storage companyID exists in response collection
          // if yes, use that companyID as active company
          // if no, set active company as the first company in response
          const companyId = this.storageService.getCompanyId;

          if (companyId) {
            this.companies.forEach(company => {
              if (company.id === companyId) {
                this.companySelected = company;
              }
            });
          }

          // user does not belong to storage companyId
          // default to the first company
          if (!this.companySelected) {
            this.companySelected = this.companies[0];
            this.storageService.setCompanyId(this.companySelected.id);
          }
        }
      });
  }

  toggleNav($event: any) {
    if (this.toggleStyle === 'sidebar-expanded') {
      this.toggleStyle = 'sidebar-minimized';
      return;
    }

    this.toggleStyle = 'sidebar-expanded';
  }

  // User selected a company
  async companyChanged(company: Company) {
    if (this.companySelected.id === company.id) {
      return;
    }

    this.spinner.show();
    this.companySelected = company;
    this.storageService.setCompanyId(this.companySelected.id);
    this.broadcastService.broadcastTask(new BroadcastMessage(this.messageService.companySwitchSender));

    await this.authService.login();
  }

  goCompany() {
    this.router.navigate(['/protected/company'], { queryParams: { id: this.companySelected.id } });
  }

  signout() {
    this.authService.signout();
  }

}

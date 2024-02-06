import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { SearchResult } from 'src/app/interfaces/search-result';
import { CustomerNew } from 'src/app/models/customer-new.model';
import { CustomerSearch } from 'src/app/models/customer-search.model';
import { CustomerService } from 'src/app/protected/customer/customer.service';
import { MessageService } from 'src/app/providers/message.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { CustomerGroupService } from 'src/app/protected/customer-group/customer-group.service';
import { InvoiceService } from 'src/app/protected/invoice/invoice.service';
import { InvoiceSearch } from 'src/app/interfaces/invoice-search';
import { Chart, registerables } from 'chart.js';
import { SpinnerService } from 'src/app/providers/spinner.service';
import { Router } from '@angular/router';
import { UserService } from '../../company/user.service';
import { User } from 'src/app/models/user.model';
import { MatTableDataSource } from '@angular/material/table';
Chart.register(...registerables);

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  claims: any;
  companyId: string = '';
  page = 1;
  pageSize = 10;
  searchText = '';
  busy: boolean = false;
  customers: number = 0;
  activeCustomers: number = 0;
  inactiveCustomers: number = 0;
  customerGroups: number = 0;
  invoices: number = 0;
  chart: any;
  users: User[] = [];
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'orderNo',
    'name',
    'email',
    'isOwner',
  ];

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private messageService: MessageService,
    private toastService: ToastService,
    private storageService: StorageService,
    private customerGroupService: CustomerGroupService,
    private invoiceService: InvoiceService,
    private spinner: SpinnerService,
    public route: Router,
    private userService: UserService,
    private elementRef: ElementRef
  ) { }

  async ngOnInit() {
    this.spinner.show();
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.getCustomers();
    this.loadUsers();
    this.getCustomerGroups();
    this.searchInvoices();
    await this.getActiveCustomers();
    //this.createChart();
  }

  public searchCustomers(model: CustomerSearch): Promise<any> {
    return this.customerService.search(this.companyId, this.searchText, model, this.page, this.pageSize, 'asc')
      .toPromise();
  }

  getCustomers(href?: string): void {
    this.busy = true;
    const model = <CustomerNew>{};

    this.searchCustomers(model).then((result: SearchResult) => {
      this.customers = result.rows;
    }, (reject) => {
      this.toastService.error(this.messageService.serverError);
    })
      .catch((error) => {
        this.toastService.error(this.messageService.serverError);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  public searchCustomerGroup(companyId: string): Promise<any> {
    return this.customerGroupService.search(companyId, this.searchText, this.page, this.pageSize, 'asc', false)
      .toPromise();
  }

  getCustomerGroups(): void {
    this.busy = true;

    this.searchCustomerGroup(this.companyId).then((result: SearchResult) => {
      this.customerGroups = result.rows;
    }, (reject) => {
      this.toastService.error(this.messageService.serverError);
    })
      .catch((error) => {
        this.toastService.error(this.messageService.serverError);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  public getInvoices(model: InvoiceSearch): Promise<any> {
    return this.invoiceService.searchInvoice(this.companyId, model, this.page, this.pageSize, 'desc')
      .toPromise();
  }

  public searchInvoices(): void {
    this.busy = true;
    const model = <InvoiceSearch>{};
    this.getInvoices(model).then((result: SearchResult) => {
      this.invoices = result.rows;
    }, (reject) => {
      this.toastService.error(this.messageService.serverError);
    })
      .catch((error) => {
        this.toastService.error(this.messageService.serverError);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  public createChart(active: number, inactive: number) {
    //this.spinner.hide();
    let htmlRef = this.elementRef.nativeElement.querySelector(`#MyChart`);
    this.chart = new Chart(htmlRef, {
      type: 'doughnut',
      data: {
        labels: [
          //'Red',
          'Active Customers',
          'Inactive Customers'
        ],
        datasets: [{
          label: 'Customers',
          //data: [300, 50, 100],
          data: [active, inactive],
          backgroundColor: [
            //'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      }
    });
  }

  public searchCustomersWithStatus(model: CustomerSearch, active: boolean): Promise<any> {
    return this.customerService.searchWithStatus(this.companyId, this.searchText, model, this.page, this.pageSize, 'asc', '', active)
      .toPromise();
  }

  async getActiveCustomers(href?: string) {
    this.busy = true;
    const model = <CustomerNew>{};

    await this.searchCustomersWithStatus(model, true).then((result: SearchResult) => {
      this.activeCustomers = result.rows;
      this.getInActiveCustomers();
    }, (reject) => {
      this.toastService.error(this.messageService.serverError);
    })
      .catch((error) => {
        this.toastService.error(this.messageService.serverError);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  async getInActiveCustomers(href?: string) {
    this.busy = true;
    const model = <CustomerNew>{};

    await this.searchCustomersWithStatus(model, false).then((result: SearchResult) => {
      this.inactiveCustomers = result.rows;
      this.createChart(this.activeCustomers, this.inactiveCustomers);
    }, (reject) => {
      this.toastService.error(this.messageService.serverError);
    })
      .catch((error) => {
        this.toastService.error(this.messageService.serverError);
      })
      .finally(() => {
        this.busy = false;
        this.spinner.hide();
      });
  }

  public getAllUsers(companyId: string): Promise<any> {
    return this.userService.getUsers(companyId).toPromise();
  }

  public loadUsers() {
    this.busy = true;
    this.getAllUsers(this.companyId).then((result) => {
      this.dataSource = new MatTableDataSource<User>(result.slice(0, 5));
      this.users = result;
    }, (reject) => {
      this.toastService.error(reject);
    })
      .catch((error) => {
        this.toastService.error(error);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  goToCustomerGroup() {
    this.route.navigate(['/protected/customer-group']);
  }

  goToCustomer() {
    this.route.navigate(['/protected/customer']);
  }

  goToInvoice() {
    this.route.navigate(['/protected/invoice']);
  }

}

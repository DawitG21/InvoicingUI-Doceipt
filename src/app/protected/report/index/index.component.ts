import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  LoadEventArgs,
  PageChangeEventArgs,
  PdfViewerComponent,
} from '@syncfusion/ej2-angular-pdfviewer';

import { ClickEventArgs, ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import { Button } from '@syncfusion/ej2-angular-buttons';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { HelperService } from 'src/app/providers/helper.service';
import { SpinnerService } from 'src/app/providers/spinner.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { MessageService } from 'src/app/providers/message.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ReportService } from '../report.service';
import { BranchService } from '../../branch/branch.service';
import { UserService } from '../../company/user.service';
import { PaymentCycleService } from '../../payment-cycle/payment-cycle.service';
import { CustomerGroupService } from '../../customer-group/customer-group.service';
import { FinancialPeriodService } from '../../financial-period/financial-period.service';

import { Branch } from 'src/app/models/branch.model';
import { ReportFilter } from 'src/app/models/report-filter.model';
import { RoleReport } from 'src/app/models/role-report.model';
import { PaymentCycle } from 'src/app/models/payment-cycle.model';
import { FinancialPeriod } from 'src/app/models/financial-period.model';
import { CustomerGroup } from 'src/app/models/customer-group.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { MatDialog } from '@angular/material/dialog';

import { CustomerSearchComponent } from '../../customer/customer-search/customer-search.component';
import { ConfigService } from 'src/app/shared/config.service';
import { SearchResult } from 'src/app/interfaces/search-result';
import { Service } from 'src/app/models/service.model';
import { ServiceService } from '../../service/service.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [],
})

export class IndexComponent implements OnInit, OnDestroy {

  public branchesControl = new FormControl([]);
  public customerGroupsControl = new FormControl([]);
  public paymentCyclesControl = new FormControl([]);
  public servicesControl = new FormControl([]);

  @ViewChild('pdfViewer')
  public pdfViewer: PdfViewerComponent | any;

  @ViewChild('topToolbar')
  public topToolbar: ToolbarComponent | any;

  @ViewChild('zoomToolbar')
  public zoomToolbar: ToolbarComponent | any;

  public reportFilter: ReportFilter | any;
  private companyId: string = '';
  public roleReports: RoleReport[] = [];
  public selectedReport: RoleReport | any;

  private page = 1;
  private pageSize = 10;
  private sortOrder = 'asc';
  public branches: Branch[] = [];
  public paymentCycles: PaymentCycle[] = [];
  public financialPeriods: FinancialPeriod[] = [];
  public customerGroupList: CustomerGroup[] = [];
  public services: Service[] = [];
  public busy: boolean = false;
  public subscription: Subscription;
  private model: ReportFilter | any;
  public claims: any;
  public disableCustomer = true;
  public financialPeriodName = new FormControl({ value: '', disabled: true });
  public financialPeriodExists: boolean = false;
  public selectedfinancialPeriod!: FinancialPeriod;

  form = new FormGroup({
    'fromDate': new FormControl(" "),
    'toDate': new FormControl(" "),
    'branchIds': new FormControl({ value: [], disabled: true }),
    'customer': new FormControl({ value: " ", disabled: true }),
    'customerGroupIds': new FormControl({ value: [], disabled: true }),
    'paymentCycleIds': new FormControl({ value: [], disabled: true }),
    'serviceIds': new FormControl({ value: [], disabled: true }),
  });

  // service = 'https://ej2services.syncfusion.com/production/web-services/api/pdfViewer';
  service = `${this.configService.resourceApiServiceURI}/pdfviewer`;
  document: string = '';
  fitPageBtn: any;
  fitWidthBtn: any;
  nextPageBtn: any;
  previousPageBtn: any;
  printBtn: any;
  zoomInBtn: any;
  zoomOutBtn: any;
  zoomInTopBtn: any;
  zoomOutTopBtn: any;

  constructor(
    private reportService: ReportService,
    private userService: UserService,
    private storageService: StorageService,
    private branchService: BranchService,
    private paymentCycleService: PaymentCycleService,
    private serviceService: ServiceService,
    private financialPeriodService: FinancialPeriodService,
    public customerGroupService: CustomerGroupService,
    public dialog: MatDialog,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    public helper: HelperService,
    private spinner: SpinnerService,
    private toastService: ToastService,
    private authService: AuthService,
    private configService: ConfigService
  ) {
    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.customerSearchSender) {
          this.form.get('customer')!.setValue(message.data.name);
        }
      });
  }

  ngOnInit() {
    this.document = '';
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.branches = [];
    this.customerGroupList = [];
    this.financialPeriods = [];
    this.paymentCycles = [];
    this.services = [];

    // search service after every key stroke
    this.financialPeriodName.valueChanges
      .subscribe(value => {
        if (value.length >= 1) {
          this.searchFinancialPeriod(value)
            .then((result: SearchResult) => {
              this.financialPeriods = result.data;
              this.financialPeriodValidator();
              this.financialPeriodName.updateValueAndValidity({ emitEvent: false });
            })
        }
        else {
          return null;
        }
      });

    if (this.claims && this.claims.doceipt_claim_customer_access) {
      this.disableCustomer = false;
      this.form.get('customer')!.enable();
    }

    this.getUserReport(this.companyId).then((result) => {
      this.roleReports = result;
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

  ngOnDestroy() {
    try {
      if (!this.pdfViewer?.isDestroyed) {
        this.pdfViewer?.destroy();
      }
    } catch { }
  }

  public createTopToolbar(): void {
    this.fitWidthBtn = new Button({ iconCss: 'e-icons e-pv-fit-width-icon' });
    this.fitWidthBtn.appendTo('#fit_width');

    this.nextPageBtn = new Button({ iconCss: 'e-icons e-pv-next-page-navigation-icon' });
    this.nextPageBtn.appendTo('#next_page');

    this.previousPageBtn = new Button({ iconCss: 'e-icons e-pv-previous-page-navigation-icon' });
    this.previousPageBtn.appendTo('#previous_page');

    this.printBtn = new Button({ iconCss: 'e-icons e-pv-print-document-icon' });
    this.printBtn.appendTo('#print');

    this.zoomInTopBtn = new Button({ iconCss: 'e-icons e-pv-zoom-in-icon' });
    this.zoomInTopBtn.appendTo('#zoom_in_top');

    this.zoomOutTopBtn = new Button({ iconCss: 'e-icons e-pv-zoom-out-icon' });
    this.zoomOutTopBtn.appendTo('#zoom_out_top');

    this.fitWidthBtn.element.onclick = ($event: any) => { this.widthFitClicked($event) };
    this.nextPageBtn.element.onclick = ($event: any) => { this.nextClicked($event) };
    this.previousPageBtn.element.onclick = ($event: any) => { this.previousClicked($event) };
    this.printBtn.element.onclick = ($event: any) => { this.printClicked($event) };
    this.zoomInTopBtn.element.onclick = ($event: any) => { this.zoomInClicked($event) };
    this.zoomOutTopBtn.element.onclick = ($event: any) => { this.zoomOutClicked($event) };
  }

  public createZoomToolbar(): void {
    this.fitPageBtn = new Button({ iconCss: 'e-icons e-pv-fit-page-icon' });
    this.fitPageBtn.appendTo('#fit_page');

    this.zoomInBtn = new Button({ iconCss: 'e-icons e-pv-zoom-in-icon' });
    this.zoomInBtn.appendTo('#zoom_in');

    this.zoomOutBtn = new Button({ iconCss: 'e-icons e-pv-zoom-out-icon' });
    this.zoomOutBtn.appendTo('#zoom_out');

    this.fitPageBtn.element.onclick = ($event: any) => { this.pageFitClicked($event) };
    this.zoomInBtn.element.onclick = ($event: any) => { this.zoomInClicked($event) };
    this.zoomOutBtn.element.onclick = ($event: any) => { this.zoomOutClicked($event) }
  }

  public getUserReport(companyId: string): Promise<any> {
    return this.userService.getUserReport(companyId).toPromise();
  }

  public openDocument(e?: any): void {
    document.getElementById('fileUpload')!.click();
  }

  private readFile(event: any): void {
    const upoadedFiles: any = event.target.files;
    if (event.target.files[0] !== null) {
      const uploadedFile: File = upoadedFiles[0];
      if (uploadedFile) {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(uploadedFile);
        const proxy: any = this;
        reader.onload = (e: any): void => {
          const uploadedFileUrl: string = e.currentTarget.result;
          proxy.pdfViewerControl.load(uploadedFileUrl, null);
        };
      }
    }
  }

  public pageChanged(e?: PageChangeEventArgs): void {
    (document.getElementById('currentPage') as HTMLInputElement).value = this.pdfViewer?.currentPageNumber.toString();
    this.updatePageNavigation();
  }

  public onCurrentPageBoxKeypress(e: KeyboardEvent): boolean {
    const keyCode = e.key.charCodeAt(0);
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 13) {
      e.preventDefault();
      return false;
    } else {
      // tslint:disable-next-line:radix
      const currentPageNumber: number = parseInt((document.getElementById('currentPage') as HTMLInputElement).value);
      if (keyCode === 13) {
        if (currentPageNumber > 0 && currentPageNumber <= this.pdfViewer?.pageCount) {
          this.pdfViewer?.navigation.goToPage(currentPageNumber);
        } else {
          (document.getElementById('currentPage') as HTMLInputElement).value = this.pdfViewer?.currentPageNumber.toString();
        }
      }
      return true;
    }
  }

  public onCurrentPageBoxClicked(event: any): void {
    (document.getElementById('currentPage') as HTMLInputElement).select();
  }

  public documentLoaded(event: any): void {
    document.getElementById('totalPage')!.textContent = 'of ' + this.pdfViewer?.pageCount;
    (document.getElementById('currentPage') as HTMLInputElement).value = this.pdfViewer?.currentPageNumber.toString();
    this.updatePageNavigation();
  }

  public updatePageNavigation(): void {
    if (this.pdfViewer?.currentPageNumber === 1) {
      this.topToolbar.enableItems(document.getElementById('previousPage'), false);
      this.topToolbar.enableItems(document.getElementById('nextPage'), true);
    } else if (this.pdfViewer?.currentPageNumber === this.pdfViewer?.pageCount) {
      this.topToolbar.enableItems(document.getElementById('previousPage'), true);
      this.topToolbar.enableItems(document.getElementById('nextPage'), false);
    } else {
      this.topToolbar.enableItems(document.getElementById('previousPage'), true);
      this.topToolbar.enableItems(document.getElementById('nextPage'), true);
    }
  }

  public firstClicked(event: any): void {
    this.pdfViewer?.navigation.goToFirstPage();
  }

  public previousClicked(event: any): void {
    this.pdfViewer?.navigation.goToPreviousPage();
  }

  public nextClicked(event: any): void {
    this.pdfViewer?.navigation.goToNextPage();
  }

  public lastClicked(event: any): void {
    this.pdfViewer?.navigation.goToLastPage();
  }

  public printClicked(event: any): void {
    this.pdfViewer?.print?.print();
  }

  public downloadClicked(event: any): void {
    const fileName: string = (document.getElementById('fileUpload') as HTMLInputElement).value.split('\\').pop() ?? '';
    if (fileName !== '' && this.pdfViewer) {
      this.pdfViewer.fileName = fileName;
    }
    this.pdfViewer?.download();
  }

  public pageFitClicked(event: any): void {
    if (!this.document) return;

    this.pdfViewer?.magnification.fitToPage();
    this.updateZoomButtons();
    this.topToolbar.enableItems(document.getElementById('fitPage'), false);
  }

  public zoomInClicked(event: any): void {
    this.pdfViewer?.magnification.zoomIn();
    this.updateZoomButtons();
  }

  public zoomOutClicked(event: ClickEventArgs): void {
    this.pdfViewer?.magnification.zoomOut();
    this.updateZoomButtons();
  }

  public widthFitClicked(event: any): void {
    if (!this.document) return;

    this.pdfViewer?.magnification.fitToWidth();
    this.updateZoomButtons();
    this.topToolbar.enableItems(document.getElementById('fitWidth'), false);
  }

  public updateZoomButtons(): void {
    if (!this.document) return;

    if (this.pdfViewer?.zoomPercentage <= 50) {
      this.zoomToolbar.enableItems(document.getElementById('zoomIn'), true);
      this.zoomToolbar.enableItems(document.getElementById('zoomOut'), false);
      this.zoomToolbar.enableItems(document.getElementById('fitPage'), true);

      this.topToolbar.enableItems(document.getElementById('zoomInTop'), true);
      this.topToolbar.enableItems(document.getElementById('zoomOutTop'), false);
      this.topToolbar.enableItems(document.getElementById('fitWidth'), true);
    } else if (this.pdfViewer?.zoomPercentage >= 400) {
      this.zoomToolbar.enableItems(document.getElementById('zoomIn'), false);
      this.zoomToolbar.enableItems(document.getElementById('zoomOut'), true);
      this.zoomToolbar.enableItems(document.getElementById('fitPage'), true);

      this.topToolbar.enableItems(document.getElementById('zoomInTop'), false);
      this.topToolbar.enableItems(document.getElementById('zoomOutTop'), true);
      this.topToolbar.enableItems(document.getElementById('fitWidth'), true);
    } else {
      this.zoomToolbar.enableItems(document.getElementById('zoomIn'), true);
      this.zoomToolbar.enableItems(document.getElementById('zoomOut'), true);
      this.zoomToolbar.enableItems(document.getElementById('fitPage'), true);

      this.topToolbar.enableItems(document.getElementById('zoomInTop'), true);
      this.topToolbar.enableItems(document.getElementById('zoomOutTop'), true);
      this.topToolbar.enableItems(document.getElementById('fitWidth'), true);
    }
  }

  public loadReport(): void {
    if (!this.selectedReport.code) {
      this.toastService.warning(this.messageService.NO_REPORT_SELECTED);
      this.spinner.hide();
      return;
    }    
    this.document = '';
    this.spinner.show();
    this.model = this.form.value as ReportFilter;
    if (this.financialPeriodExists) {
      this.model.financialPeriodId = this.selectedfinancialPeriod.id;
    } else {
      this.model.financialPeriodId = "";
    }
    if (this.selectedReport.code == "PAYMENT_BY_SERVICE" && this.model.financialPeriodId == "") {
      this.toastService.warning(this.messageService.finanacialPeriodMandatory);
      this.spinner.hide();
      return;
    }
    const branchIds = [];
    const customerGroupIds = [];
    const paymentCycleIds = [];
    const serviceIds = [];
    for (const branchId of this.branchesControl.value) {
      branchIds.push(branchId.id);
    }
    for (const customerGroupId of this.customerGroupsControl.value) {
      customerGroupIds.push(customerGroupId.id);
    }
    for (const paymentCycleId of this.paymentCyclesControl.value) {
      paymentCycleIds.push(paymentCycleId.id);
    }
    for (const serviceId of this.servicesControl.value) {
      serviceIds.push(serviceId.id);
    }
    this.model.branchIds = branchIds;
    this.model.customerGroupIds = customerGroupIds;
    this.model.paymentCycleIds = paymentCycleIds;
    this.model.serviceIds = serviceIds;
    if (this.model.fromDate != null) {
      this.model.fromDate = this.helper.getDateString(this.helper.getDate(this.model.fromDate));
    }
    if (this.model.toDate != null) {
      this.model.toDate = this.helper.getDateString(this.helper.getDate(this.model.toDate));
    }
    if (this.model.fromDate == null)
      this.model.fromDate = "";
    if (this.model.toDate == null)
      this.model.toDate = "";
    if (this.model.customer == null)
      this.model.customer = "";
    this.reportService.pdfReport(this.model, this.selectedReport.code).subscribe((data: any) => {
      const pdf = `data:application/pdf;base64,${data}`;
      this.document = pdf;
      this.spinner.hide();
    }, (error: any) => {
      this.spinner.hide();
      // handle error
    });
  }

  public async selectReportType(report: RoleReport) {
    this.selectedReport = report;
    this.selectedReport.reportFlags.sort((a: any, b: any) => a.flag.dataType.localeCompare(b.flag.dataType) || a.name.localeCompare(b.name));
    this.form.reset();
    this.branchesControl!.setValue([]);
    this.customerGroupsControl!.setValue([]);
    this.paymentCyclesControl!.setValue([]);
    this.servicesControl!.setValue([]);
    for (const reportFlag of report.reportFlags) {
      if (reportFlag.flag.dataType === 'guid') {
        if (reportFlag.name.includes('branch') && this.claims && this.claims.doceipt_claim_branch_access) {
          if (this.branches.length === 0) {
            this.searchBranch();
          }
        }
        if (reportFlag.name.includes('paymentCycle') && this.claims && this.claims.doceipt_claim_paymentcycle_access) {
          if (this.paymentCycles.length === 0) {
            this.getPaymentCycles();
          }
        }
        if (reportFlag.name.includes('service') && this.claims && this.claims.doceipt_claim_service_access) {
          if (this.services.length === 0) {
            this.getServices();
          }
        }
        if (reportFlag.name.includes('financialPeriod') && this.claims && this.claims.doceipt_claim_financialperiod_access) {
          if (this.financialPeriods.length === 0) {
            this.getFinancialPeriods();
          }
        }
        if (reportFlag.name.includes('customerGroup') && this.claims && this.claims.doceipt_claim_customergroup_access) {
          if (this.customerGroupList.length === 0) {
            this.customerGroupList = await this.customerGroupService.getAll(this.companyId, this.page, this.pageSize);
            this.form.get('customerGroupIds')!.enable();
          }
        }
      }
    }
  }

  public searchBranch() {
    this.busy = true;
    this.branchService.getAll(this.companyId, this.page, this.pageSize)
      .then((result) => {
        this.branches = result;
        this.form.get('branchIds')!.enable();
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

  public getAllServices(companyId: string): Promise<any> {
    return this.serviceService.getAll(companyId, this.page, this.pageSize);
  }

  private getServices() {
    this.busy = true;
    this.getAllServices(this.companyId).then((result) => {
      this.services = result;
      this.form.get('serviceIds')!.enable();
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

  public getAllPaymentCycle(companyId: string): Promise<any> {
    return this.paymentCycleService.getAll(companyId, this.page, this.pageSize);
  }

  private getPaymentCycles() {
    this.busy = true;
    this.getAllPaymentCycle(this.companyId).then((result) => {
      this.paymentCycles = result;
      this.form.get('paymentCycleIds')!.enable();
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

  public searchFinancialPeriod(value: string): Promise<any> {
    return this.financialPeriodService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  private getFinancialPeriods() {
    this.busy = true;
    this.searchFinancialPeriod(" ").then((result) => {
      this.financialPeriods = result.data;
      this.financialPeriodName.enable();
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

  openDialog(): void {
    const dialogRef = this.dialog.open(CustomerSearchComponent, {
      width: '550px',
      data: { show: true, },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // dialog closed
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

  public disSelect(formControlName: string) {
    this.form.get(formControlName)!.setValue(null);
  }

  get getCustomer() {
    return this.form.get('customer');
  }

  get getFromDate() {
    return this.form.get('fromDate');
  }

  get getToDate() {
    return this.form.get('toDate');
  }

  public financialPeriodValidator(): any {
    this.financialPeriodExists = false;
    let fp = this.financialPeriodName.value;
    for (let i = 0; i < this.financialPeriods.length; i++) {
      if (this.financialPeriods[i].name === fp) {
        this.financialPeriodExists = true;
        this.selectedfinancialPeriod = this.financialPeriods[i];
        this.financialPeriodName.clearValidators();
      }
    }
    if (!this.financialPeriodExists) {
      this.financialPeriodExists = false;
      this.financialPeriodName.setValidators(f => <any>{ notvalid: true });
    }
  }

}

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CompanyService } from '../company.service';
import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { MessageService } from 'src/app/providers/message.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MachineService } from '../machine.service';
import { HelperService } from 'src/app/providers/helper.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { TemplateService } from '../template.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Machine } from 'src/app/models/machine.model';
import { Company } from 'src/app/models/company.model';
import { Template } from 'src/app/models/template.model';

import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { SearchResult } from 'src/app/interfaces/search-result';
import * as _ from 'lodash';
import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { TemplateAdd } from 'src/app/models/template-add.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  companyId: string = '';
  company: Company | any;
  machines: Machine[] = [];
  subscription: Subscription;
  claims: any;
  busy: boolean = false;
  indexMachine: number | any;
  public templates: Template[] = [];
  public allTemplates: Template[] = [];
  public templatesPiped: any;
  public favoriteInvoice: string = '';
  public favoriteReceipt: string = '';
  public page = 1;
  public pageSize = 10;
  public searchText = '';
  public sortOrder = 'asc';

  displayedColumnsMachine: string[] = [
    'name',
    'machineNo',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<Machine>();

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private messageService: MessageService,
    private storageService: StorageService,
    private authService: AuthService,
    private machineService: MachineService,
    private helperService: HelperService,
    private templateService: TemplateService,
    private resEndpoint: ResourceEndpointService,
  ) {

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companyDetailAddSender ||
          message.sender === this.messageService.companyDetailEditSender) {
          this.company.companyDetail = message.data;
        } else if (message.sender === this.messageService.machineAddSender) {
          this.machines.push(message.data);
        } else if (message.sender === this.messageService.machineEditSender) {
          this.machines[this.indexMachine] = message.data;
        } else if (message.sender === this.messageService.companySwitchSender) {
          // reload page
          this.companyId = this.storageService.getCompanyId;
          this.router.navigate(['.'], {
            relativeTo: this.route,
            queryParams: { id: this.companyId }
          });

          this.initialize(true);

        }
      });
  }

  initialize(reloaded?: boolean) {
    this.indexMachine = null;

    if (!reloaded) {
      this.companyId = this.route.snapshot.queryParamMap.get('id') ?? '';
    }

    this.getCompanyInfo();
    if (this.claims && this.claims.doceipt_claim_machine_access) {
      this.loadMachines();
    }
    this.getAllTemplates();
    this.searchTemplates();
  }

  public getCompany(companyId: string): Promise<any> {
    return this.companyService.get(companyId).toPromise();
  }

  public getCompanyInfo() {
    this.busy = true;
    this.getCompany(this.companyId).then((result: Company) => {
      this.company = result;
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

  public getMachines(companyId: string): Promise<any> {
    return this.machineService.search(companyId, this.searchText, this.page, this.pageSize, this.sortOrder).toPromise();
  }

  public loadMachines() {
    this.busy = true;
    this.getMachines(this.companyId).then((result: SearchResult) => {
      this.machines = result.data;
      this.dataSource = new MatTableDataSource<Machine>(result.data);
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

  ngOnInit() {
    this.claims = this.authService.userClaims;
    this.initialize();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getActiveColor(isActive: boolean): string {
    return this.helperService.getActiveColor(isActive);
  }

  goAddMachine() {
    this.router.navigate(['/protected/company/add-machine']);
  }

  goEditMachine(arg: any) {
    this.storageService.setData('data', arg);
    this.router.navigate(['/protected/company/edit-machine']);
  }

  deleteMachine(id: string): Promise<any> {
    return this.machineService.delete(id).toPromise();
  }

  getDeleteDialog(machine: Machine, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} this Machine<br>
        <b>${machine.name}</b>?`,
        input: machine.id
      },
    });
  }

  openDeleteDialog(machine: Machine) {
    const dialogRef = this.getDeleteDialog(machine, 'delete');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.deleteMachine(result)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
            const filtered = data.filter(e => e.id !== result);
            this.dataSource.data = filtered;
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
    });
  }

  goAddDetail() {
    this.router.navigate(['/protected/company/add-detail']);
  }

  goEditDetail() {
    this.storageService.setData('data', this.company.companyDetail);
    this.router.navigate(['/protected/company/edit-detail']);
  }

  sendMessages() {
    this.companyService.sentMessage(this.companyId)
      .subscribe(() => {
        this.toastService.success(this.messageService.sendingEmails);
      });
  }

  create() {
    this.router.navigate(['/protected/company/add']);
  }

  goManageOrg() {
    this.router.navigate(['/protected/company/manage-org']);
  }

  public search(companyId: string): Promise<any> {
    return this.templateService.search(this.page, this.pageSize, this.sortOrder, companyId, this.searchText).toPromise();
  }

  public searchTemplates() {
    this.busy = true;
    this.search(this.companyId).then((result: SearchResult) => {
      this.templates = result.data;
      for (const template of this.templates) {
        if (template.category === 'Invoice') {
          this.favoriteInvoice = template.id;
        }
        if (template.category === 'Receipt') {
          this.favoriteReceipt = template.id;
        }
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
  }

  public getAll(companyId: string): Promise<any> {
    const baseUrl = this.resEndpoint.TemplateUri;
    const url = `${baseUrl}/search?searchText=&page=1&pageSize=10&sortOrder=asc`;
    return this.templateService.search(this.page, this.pageSize, this.sortOrder, companyId, this.searchText, url).toPromise();
  }

  public getAllTemplates() {
    this.busy = true;
    this.getAll(this.companyId).then((result: SearchResult) => {
      this.allTemplates = result.data;
      this.templatesPiped = _.groupBy(this.allTemplates, (template: Template) => {
        return template.category.replace(/\s/g, '');
      });
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

  public addTemplate(model: TemplateAdd): Promise<any> {
    return this.companyService.addTemplate(model).toPromise();
  }

  public companyTemplateAdd(model: TemplateAdd) {
    this.addTemplate(model).then(() => {
      this.toastService.success(this.messageService.operationSuccesful);
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

  public receiptRadioChange(id: string) {
    this.busy = true;
    const model = new TemplateAdd();
    model.companyId = this.companyId;
    model.templateId = id;
    this.companyTemplateAdd(model);
  }

  public invoiceRadioChange(id: string) {
    this.busy = true;
    const model = new TemplateAdd();
    model.companyId = this.companyId;
    model.templateId = id;
    this.companyTemplateAdd(model);
  }
}

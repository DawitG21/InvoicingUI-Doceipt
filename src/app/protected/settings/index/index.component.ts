import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { MessageService } from 'src/app/providers/message.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { ConnectorService } from '../connector.service';
import { SourceService } from '../source.service';

import { ApikeyDialogComponent } from '../../app-dialog/apikey-dialog/apikey-dialog.component';
import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

import { Connector } from 'src/app/models/connector.model';
import { Source } from 'src/app/models/source.model';

import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-index',
  styleUrls: ['./index.component.scss'],
  templateUrl: './index.component.html',
})

export class IndexComponent implements OnInit {

  public companyId: string = '';
  public busy: boolean = false;
  public claims: any;
  public searchText = '';

  public pageSizeSource = 5;
  public dataSource = new MatTableDataSource<Source>();
  public displayedColumnsSource: string[] = [
    'name',
    'customerUrl',
    'branchUrl',
    'customerGroupUrl',
    'isActive',
    'actions',
  ];

  public pageConnector = 1;
  public pageSizeConnector = 5;
  public dataSourceConnector = new MatTableDataSource<Connector>();
  public displayedColumnsConnector: string[] = [
    'name',
    'description',
    'actions',
  ];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private storageService: StorageService,
    private sourceService: SourceService,
    private messageService: MessageService,
    private toastService: ToastService,
    private connectorService: ConnectorService,
    private authService: AuthService,
  ) { }

  public initialize() {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;

    if (this.claims && this.claims.doceipt_claim_source_access) {
      this.searchSources();
    }
    if (this.claims && this.claims.doceipt_claim_connector_access) {
      this.searchConnectors();
    }
  }

  public ngOnInit() {
    this.initialize();
  }

  public getAllSources(companyId: string): Promise<any> {
    return this.sourceService.getAll(companyId).toPromise();
  }

  public searchSources() {
    this.busy = true;
    this.getAllSources(this.companyId).then((result) => {
      this.dataSource = new MatTableDataSource<Source>(result);
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

  public getAllConnectors(companyId: string, searchText: string): Promise<any> {
    return this.connectorService.search(companyId, searchText, this.pageConnector, this.pageSizeConnector, 'asc')
      .toPromise();
  }

  public searchConnectors() {
    this.busy = true;
    this.getAllConnectors(this.companyId, this.searchText).then((result: SearchResult) => {
      this.dataSourceConnector = new MatTableDataSource<Connector>(result.data);
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

  goAddSource() {
    this.router.navigate(['/protected/settings/add-source']);
  }

  goAddConnector() {
    this.router.navigate(['/protected/settings/add-connector']);
  }

  deleteSource(id: string): Promise<any> {
    return this.sourceService.delete(id).toPromise();
  }

  getDeleteDialog(element: Source, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the source<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: Source) {
    const dialogRef = this.getDeleteDialog(element, 'delete');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.deleteSource(result)
          .then(() => {
            const filtered = data.filter(e => e.id !== result);
            this.dataSource.data = filtered;
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
    });
  }

  edit(arg: any) {
    this.storageService.setData('data', arg);
    this.router.navigate(['protected/settings/edit-source']);
  }

  editConnector(arg: any) {
    this.storageService.setData('data', arg);
    this.router.navigate(['protected/settings/update-connector']);
  }

  openApiKeyDialog(apiKey: string) {
    return this.dialog.open(ApikeyDialogComponent, {
      width: '800px',
      data: { message: apiKey }
    });
  }

  public renew(id: string): Promise<any> {
    return this.connectorService.renewApiKey(id).toPromise();
  }

  public renewApiKey(id: string) {
    this.busy = true;
    this.renew(id).then((result) => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.openApiKeyDialog(result.apiKeyHashless);
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

  public deleteConnector(id: string): Promise<any> {
    return this.connectorService.delete(id).toPromise();
  }

  public getConnectorDeleteDialog(element: Connector, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: element.id,
        message: `Are you sure you want to ${action} the connector<br>
        <b>${element.name}</b>?`,
      },
      width: '450px',
    });
  }

  public openConnectorDeleteDialog(element: Connector) {
    const dialogRef = this.getConnectorDeleteDialog(element, 'delete');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.claims && this.claims.doceipt_user_isOwner) {
          const data = this.dataSourceConnector.data;
          this.busy = true;
          this.deleteConnector(result)
            .then(() => {
              const filtered = data.filter(e => e.id !== result);
              this.dataSourceConnector.data = filtered;
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
        } else {
          this.toastService.error(this.messageService.NO_ENOUGH_PERMISSION);
        }
      }
    });
  }

}

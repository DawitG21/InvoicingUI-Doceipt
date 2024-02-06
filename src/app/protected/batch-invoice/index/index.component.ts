import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { BatchInvoiceCreateDialogComponent } from '../batch-invoice-create-dialog/batch-invoice-create-dialog.component';
import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';

import { AuthService } from 'src/app/core/authentication/auth.service';
import { BatchInvoiceService } from '../batch-invoice.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';

import { SearchResult } from 'src/app/interfaces/search-result';
import { BatchInvoice } from 'src/app/interfaces/batch-invoice';
import { BatchInvoiceSearch } from 'src/app/interfaces/batch-invoice-search';


@Component({
  selector: 'app-index',
  styleUrls: ['./index.component.scss'],
  templateUrl: './index.component.html',
})

export class IndexComponent implements OnInit {

  public displayedColumns: string[] = [
    'financialPeriod.name',
    'paymentCycle.name',
    'customerGroup.name',
    'invoiceDate',
    'createdBy.name',
    'status',
    'actions',
  ];

  public dataSource = new MatTableDataSource<BatchInvoice>();
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator | any;

  public claims: any;
  public companyId: string = '';
  public busy: boolean = false;
  public page = 1;
  public pageSize = 10;
  public pageSizeOptions: number[] = [5, 10, 25, 50];

  constructor(
    public dialog: MatDialog,
    public batchInvoiceService: BatchInvoiceService,
    public storageService: StorageService,
    public toastService: ToastService,
    public messageService: MessageService,
    private authService: AuthService,
  ) { }

  public ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;

    this.dataSource.paginator = this.paginator;
    this.search();
  }

  public rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  public searchBatchInvoices(model: BatchInvoiceSearch): Promise<any> {
    return this.batchInvoiceService.search(this.companyId, model, this.page, this.pageSize, 'desc')
      .toPromise();
  }

  public search(): void {
    this.busy = true;
    const model = <BatchInvoiceSearch>{};

    this.searchBatchInvoices(model).then((result: SearchResult) => {
      this.dataSource = new MatTableDataSource<BatchInvoice>(result.data);
      this.rePaginate(result.rows, result.page - 1);
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

  public delete(id: string): Promise<any> {
    return this.batchInvoiceService.delete(id).toPromise();
  }

  public getDeleteOrVoidDialog(element: BatchInvoice, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: element.id,
        message: `Are you sure you want to ${action} the batch invoice<br>
        <b>${element.financialPeriod.name} - ${element.paymentCycle.name} - ${element.customerGroup.name}</b>?`,
      },
      width: '450px',
    });
  }

  public openDeleteDialog(element: BatchInvoice) {
    if (element.hasPayment) {
      this.toastService.warning('Batch Invoice has one or more linked invoices with payments');
      return;
    }
    const dialogRef = this.getDeleteOrVoidDialog(element, 'delete');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.delete(result)
          .then(() => {
            const filtered = data.filter(e => e.id !== result);
            this.dataSource.data = filtered;
            this.paginator.length = filtered.length;
            this.rePaginate(filtered.length, this.paginator.pageIndex);
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

  public openVoidDialog(element: BatchInvoice) {
    if (element.voided) {
      return;
    }

    const dialogRef = this.getDeleteOrVoidDialog(element, 'void');

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        try {
          this.busy = true;
          this.batchInvoiceService.void(result)
            .subscribe((r) => {
              const data = this.dataSource.data;
              for (let index = 0; index < data.length; index++) {
                if (data[index].id === result) {
                  data[index] = r;
                  break;
                }
              }
              this.dataSource.data = data;
            }, (reject) => {
              this.toastService.error(reject);
            });
        } catch (error) {
          this.toastService.error(this.messageService.serverError);
        } finally {
          this.busy = false;
        }
      }
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(BatchInvoiceCreateDialogComponent, {
      data: { show: true },
      disableClose: true,
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      // batch invoice dialog closed
    });
    dialogRef.backdropClick().subscribe(() => {
      // allow closing the dialog on backdrop click
      dialogRef.close();
    });
  }

  public pageEvent(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.search();
  }
}

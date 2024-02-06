import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SearchResult } from 'src/app/interfaces/search-result';
import { Penalty } from 'src/app/models/penalty';
import { Router } from '@angular/router';
import { PenaltyService } from '../penalty.service';
import { MessageService } from 'src/app/providers/message.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ConfirmDialogComponent } from '../../app-dialog/confirm-dialog/confirm-dialog.component';
import { PenaltySearch } from 'src/app/models/penalty-search.model';
import { PreviewPenaltyComponent } from '../preview-penalty/preview-penalty.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'description',
    'rate',
    'rateType',
    'financialPeriod',
    'actions'
  ];

  dataSource = new MatTableDataSource<Penalty>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;

  companyId: string = '';
  busy: boolean = false;
  public claims: any;
  public page = 1;
  public pageSize = 10;
  public searchText = '';
  public sortOrder = 'asc';

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private penaltyService: PenaltyService,
    private messageService: MessageService,
    private storageService: StorageService,
    private toastService: ToastService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initialize();

    this.dataSource.paginator = this.paginator;
  }

  rePaginate(length: number, pageIndex: number) {
    this.paginator.length = length;
    this.paginator.pageIndex = pageIndex;
  }

  initialize(reload?: boolean) {
    this.busy = true;
    this.companyId = this.storageService.getCompanyId;    
    this.claims = this.authService.userClaims;

    this.search();
  }

  public searchPenalties(model: PenaltySearch): Promise<any> {
    return this.penaltyService.search(this.companyId, this.searchText, model, this.page, this.pageSize, 'asc')
      .toPromise();
  }

  search(href?: string): void {
    this.busy = true;
    const model = <PenaltySearch>{};
    model.financialPeriodId = "";

    this.searchPenalties(model).then((result: SearchResult) => {
      console.log(result.data);
      this.dataSource = new MatTableDataSource<Penalty>(result.data);
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

  delete(id: string): Promise<any> {
    return this.penaltyService.delete(id).toPromise();
  }

  getDeleteOrVoidDialog(element: Penalty, action: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        message: `Are you sure you want to ${action} the penalty<br>
        <b>${element.name}</b>?`,
        input: element.id
      },
    });
  }

  openDeleteDialog(element: Penalty) {
    const dialogRef = this.getDeleteOrVoidDialog(element, 'delete');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data = this.dataSource.data;
        this.busy = true;
        this.delete(result)
          .then(() => {
            this.toastService.success(this.messageService.operationSuccesful);
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

  edit(arg: any) {
    this.storageService.setData('data', arg);
    this.router.navigate(['protected/penalty/edit']);
  }

  addPenalty() {
    this.router.navigate(['protected/penalty/add']);
  }

  public openDialog(element: Penalty): void {
    const dialogRef = this.dialog.open(PreviewPenaltyComponent, {
      data: { show: true, message: element },
      disableClose: true,
      width: '550px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      // branch preview dialog closed
    });
    dialogRef.backdropClick().subscribe(() => {
      // allow closing the dialog on backdrop click
      dialogRef.close();
    });
  }

}

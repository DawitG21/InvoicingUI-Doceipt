import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PenaltyNew } from 'src/app/models/penalty-new.model';
import { MessageService } from 'src/app/providers/message.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { PenaltyService } from '../penalty.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { FinancialPeriodService } from '../../financial-period/financial-period.service';
import { SearchResult } from 'src/app/interfaces/search-result';
import { PenaltyRange } from 'src/app/models/penalty-range';
import { ConsoleService } from 'src/app/providers/console.service';

@Component({
  selector: 'app-add-penalty',
  templateUrl: './add-penalty.component.html',
  styleUrls: ['./add-penalty.component.scss']
})
export class AddPenaltyComponent implements OnInit {

  form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'name': new FormControl('', [Validators.required]),
    'rate': new FormControl('', [Validators.required]),
    'rateType': new FormControl('', [Validators.required]),
    'description': new FormControl(''),
    'penaltyRates': new FormArray([]),
    'isPercentRate': new FormControl(false)
  });

  public sortOrder = 'asc';
  public page = 1;
  public pageSizeOptions: number[] = [5, 10, 25];
  public searchText = '';
  public pages: number | any;
  public pageSize = 10;
  public showActive: boolean = true;

  public ranges: PenaltyRange[] = [];
  public claims: any;
  public financialPeriods: any = [];
  model: PenaltyNew | any;
  companyId: string = '';
  message: string = '';
  status: boolean = false;
  public busy: boolean = false;
  saveStatus: boolean = false;
  public financialPeriodName = new FormControl({ value: '', disabled: true });

  constructor(
    public router: Router,
    private penaltyService: PenaltyService,
    private toastService: ToastService,
    private location: Location,
    private messageService: MessageService,
    private storageService: StorageService,
    private authService: AuthService,
    private consoleService: ConsoleService,
    private financialPeriodService: FinancialPeriodService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.companyId = this.storageService.getCompanyId;
    this.model.companyId = this.companyId;
    this.claims = this.authService.userClaims;

    this.form.get('companyId')!.setValue(this.companyId);

    // search financial period after every key stroke
    this.financialPeriodName.valueChanges
      .subscribe(value => {
        if (value.length >= 1) {
          this.searchFinancialPeriod(value)
            .then((result: SearchResult) => {
              this.financialPeriods = result.data;
              this.financialPeriodName.updateValueAndValidity({ emitEvent: false });
            })
        }
        else {
          this.financialPeriodName.clearValidators();
          this.financialPeriodName.updateValueAndValidity({ emitEvent: false });
          return null;
        }
      });

    if (this.claims && this.claims.doceipt_claim_financialperiod_access) {
      this.financialPeriodName.enable();
      this.getAllFinancialPeriods();
    }
  }

  public searchFinancialPeriod(value: string): Promise<any> {
    return this.financialPeriodService.search(this.companyId, value, this.page, this.pageSize, this.sortOrder, this.showActive).toPromise();
  }

  public getAllFinancialPeriods(): void {
    this.busy = true;
    this.searchFinancialPeriod(this.financialPeriodName.value).then((result: SearchResult) => {
      this.financialPeriods = result.data;
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

  initForm() {
    this.model = new PenaltyNew(this.companyId);
    this.ranges = [];
  }

  addPenalty(penalty: PenaltyNew): Promise<any> {
    return this.penaltyService.create(penalty).toPromise();
  }

  save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as PenaltyNew;
    this.model.penaltyRates = this.ranges;

    for (let i = 0; i < this.financialPeriods.length; i++) {
      if (this.financialPeriods[i].name == this.financialPeriodName.value)
        this.model.financialPeriodId = this.financialPeriods[i].id;
    }
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }
    this.consoleService.consoleMessage(this.model);

    this.addPenalty(this.model).then(() => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
      this.initForm();
    }, (reject) => {
      this.toastService.error(reject);
      this.saveStatus = false;
    })
      .catch((error) => {
        this.toastService.error(error);
        this.saveStatus = false
      })
      .finally(() => {
        this.busy = false;
        this.saveStatus = false;
      });
  }

  goBack() {
    this.location.back();
  }

  public addRanges() {
    this.ranges.push(new PenaltyRange());
  }

  public deleteRange(index: number) {
    this.ranges.splice(index, 1);
  }

}

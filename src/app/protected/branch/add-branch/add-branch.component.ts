import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';

import { BroadcastService } from 'src/app/providers/broadcast.service';
import { ToastService } from 'src/app/providers/toast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { BranchService } from '../branch.service';
import { MachineService } from '../../company/machine.service';
import { CountryService } from 'src/app/providers/country.service';

import { Phone } from 'src/app/models/phone.model';
import { BranchNew } from 'src/app/models/branch-new.model';
import { Machine } from 'src/app/models/machine.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';

import { Country } from 'src/app/models/country.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  selector: 'app-add-branch',
  styleUrls: ['./add-branch.component.scss'],
  templateUrl: './add-branch.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class AddBranchComponent implements OnInit, OnDestroy {

  public countries: Country[] = [];
  public model: BranchNew | any;
  public companyId: string = '';
  public machine: Machine | any;
  public status: boolean = false;
  public message: string = '';
  public machines: Machine[] = [];
  public subscription: Subscription;
  public busy: boolean = false;
  public saveStatus: boolean = false;
  public phoneNumbers: Phone[] = [];
  public selectedMachines: Machine[] = [];
  public contactsKey = 'contacts';
  public phones: any[] = [];
  public separateDialCode = true;
  public SearchCountryField = SearchCountryField;
  claims: any;
  public page = 1;
  public pageSize = 10;
  public searchText = '';
  public sortOrder = 'asc';
  
  public CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [CountryISO.Ethiopia, CountryISO.Kenya];

  public form = new FormGroup({
    addressLine1: new FormControl(''),
    addressLine2: new FormControl(''),
    city: new FormControl(''),
    companyId: new FormControl('', [Validators.required]),
    country: new FormControl(''),
    email: new FormControl(''),
    isActive: new FormControl(true),
    machines: new FormArray([]),
    name: new FormControl('', [Validators.required]),
    phoneNumbers: new FormArray([]),
    state: new FormControl(''),
  });

  constructor(
    private branchService: BranchService,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private location: Location,
    private storageService: StorageService,
    private messageService: MessageService,
    private machineService: MachineService,
    private countryService: CountryService,
    private router: Router,
    private authService: AuthService,
  ) {

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.router.navigate(['/protected/branch']);
        }
      });
  }

  public ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.claims = this.authService.userClaims;
    this.form.get('companyId')!.setValue(this.companyId);
    this.initForm();
    this.setActive(this.model.isActive);
    if (this.claims && this.claims.doceipt_claim_machine_access) {
      this.loadMachines();
    }
    this.phoneNumbers = [];
    this.phones = [];
    this.selectedMachines = [];
  }

  public initForm() {
    this.model = new BranchNew(this.companyId);
    this.countries = this.countryService.getCountries;
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getAllMachines(): Promise<any> {
    return this.machineService.search(this.companyId, this.searchText, this.page, this.pageSize, this.sortOrder, true).toPromise();
  }

  public loadMachines() {
    this.getAllMachines().then((result: SearchResult) => {
      this.machines = result.data;
    }, (reject) => {
      this.toastService.error(this.messageService.MACHINE_NOT_LOADED);
    })
      .catch((error) => {
        this.toastService.error(this.messageService.MACHINE_NOT_LOADED);
      })
      .finally(() => {
        this.busy = false;
      });
  }

  public addMachine() {
    if (!this.machine) {
      this.toastService.warning(this.messageService.NO_MACHINE_SELECTED);
      return;
    }

    // verify machine is unique
    for (const id in this.selectedMachines) {
      if (this.selectedMachines.hasOwnProperty(id)) {
        const element = this.selectedMachines[id];
        if (element.id === this.machine.id) {
          return;
        }
      } else {
        return;
      }
    }

    this.selectedMachines.push(this.machine);
    this.toastService.success(this.messageService.MACHINE_ADDED);
  }

  public removeMachine(index: number) {
    this.selectedMachines.splice(index, 1);
  }

  public setActive(e: any) {
    if (e) {
      this.message = 'Active';
      this.status = true;
    } else {
      this.message = 'Inactive';
      this.status = false;
    }
  }

  public addBranch(model: BranchNew): Promise<any> {
    return this.branchService.create(model).toPromise();
  }

  public save() {
    this.busy = true;
    this.saveStatus = true;
    for (const p of this.phones) {
      const phoneObj = new Phone();
      phoneObj.dialingCode = Number(p.phone.dialCode.substring(1));
      phoneObj.phone = Number(p.phone.number.replace(/\D/g, ''));
      this.phoneNumbers.push(phoneObj);
    }
    this.model = this.form.value as BranchNew;
    this.model.phoneNumbers = this.phoneNumbers;
    this.model.machines = this.selectedMachines;
    if (!this.model.name || this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addBranch(this.model).then((result) => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
      this.initForm();
    }, (reject) => {
      this.toastService.error(reject);
      this.saveStatus = false;
    })
      .catch((error) => {
        this.toastService.error(error);
        this.saveStatus = false;
      })
      .finally(() => {
        this.busy = false;
        this.saveStatus = false;
      });

  }

  public goBack() {
    this.location.back();
  }

  public addPhone() {
    const pho: any = {};
    const obj = { phone: pho };
    this.phones.push(obj);
  }

  public deletePhone(index: number) {
    this.phones.splice(index, 1);
  }
}

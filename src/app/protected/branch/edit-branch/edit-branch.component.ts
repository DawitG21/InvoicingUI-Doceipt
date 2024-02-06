import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

import { ToastService } from 'src/app/providers/toast.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { BranchService } from '../branch.service';
import { MachineService } from '../../company/machine.service';
import { CountryService } from 'src/app/providers/country.service';

import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Branch } from 'src/app/models/branch.model';
import { Phone } from 'src/app/models/phone.model';
import { Machine } from 'src/app/models/machine.model';

import { Country } from 'src/app/models/country.model';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { SearchResult } from 'src/app/interfaces/search-result';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-edit-branch',
  styleUrls: ['./edit-branch.component.scss'],
  templateUrl: './edit-branch.component.html',
})

export class EditBranchComponent implements OnInit, OnDestroy {

  public countries: Country[] = [];
  public model: Branch;
  public machine: Machine | any;
  public status: boolean = false;
  public saveStatus: boolean = false;
  public message: string = '';
  public machines: Machine[] = [];
  public subscription: Subscription;
  public companyId: string = '';
  public phoneNumbers: Phone[] = [];
  public phoneNumbersUnchanged: Phone[] = [];
  public selectedMachines: Machine[] = [];
  public busy: boolean = false;
  public phones: any[] = [];
  public phonesUnchanged: any[] = [];
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
    country: new FormControl(''),
    email: new FormControl(''),
    id: new FormControl('', [Validators.required]),
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
    private storageService: StorageService,
    private messageService: MessageService,
    private machineService: MachineService,
    private countryService: CountryService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.model = this.storageService.getData('data');

    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.router.navigate(['/protected/branch']);
        }
      });
  }

  public ngOnInit() {
    this.claims = this.authService.userClaims;
    this.populateData(this.model);
    this.companyId = this.storageService.getCompanyId;
    if (this.claims && this.claims.doceipt_claim_machine_access) {
      this.loadMachines();
    }
    this.countries = this.countryService.getCountries;
    this.setActive(this.model.isActive);
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

  public updateBranch(model: Branch): Promise<any> {
    return this.branchService.update(model).toPromise();
  }

  public save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as Branch;
    for (const p of this.phones) {
      const phoneObj = new Phone();
      phoneObj.dialingCode = Number(p.phone.dialCode.substring(1));
      phoneObj.phone = Number(p.phone.number.replace(/\D/g, ''));
      this.phoneNumbers.push(phoneObj);
    }
    this.model.phoneNumbers = this.phoneNumbers;

    this.model.machines = this.selectedMachines;
    if (this.model && this.model.name.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.updateBranch(this.model).then((response: Branch) => {
      this.populateData(response);
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
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
    this.router.navigate(['protected/branch']);
  }

  public addPhone() {
    const pho: any = {};
    const obj = { phone: pho };
    this.phones.push(obj);
  }

  public deletePhone(index: number) {
    this.phones.splice(index, 1);
  }

  get phoneChanged() {
    for (const p of this.phones) {
      if (p.phone) {
        const phoneObj = new Phone();
        phoneObj.dialingCode = Number(p.phone.dialCode.substring(1));
        phoneObj.phone = Number(p.phone.number.replace(/\D/g, ''));
        this.phoneNumbers.push(phoneObj);
      }
    }
    for (const p of this.phonesUnchanged) {
      const phoneObj = new Phone();
      phoneObj.dialingCode = Number(p.phone.dialCode);
      phoneObj.phone = Number(p.phone.number);
      this.phoneNumbersUnchanged.push(phoneObj);
    }
    return ((this.model.phoneNumbers.length !== this.phones.length) ||
      (JSON.stringify(this.phoneNumbers) !== JSON.stringify(this.phoneNumbersUnchanged)));
  }

  get machineChanged() {
    if ((this.machine && this.machine.id) || (this.model.machines.length !== this.selectedMachines.length)) {
      return true;
    } else {
      return false;
    }
  }

  private populateData(arg: Branch) {
    this.phones = [];
    this.phonesUnchanged = [];
    this.phoneNumbers = [];
    this.phoneNumbersUnchanged = [];
    this.machine = new Machine();
    if (arg.phoneNumbers && arg.phoneNumbers.length > 0) {
      for (const phone of arg.phoneNumbers) {
        const pho: any = {};
        pho.dialCode = phone.dialingCode;
        pho.number = phone.phone.toString();
        const obj = { phone: pho };
        const obj2 = { phone: pho };
        this.phones.push(obj);
        this.phonesUnchanged.push(obj2);
      }
    }
    this.selectedMachines = JSON.parse(JSON.stringify(arg.machines));
    this.form.get('addressLine1')!.setValue(arg.addressLine1);
    this.form.get('addressLine2')!.setValue(arg.addressLine2);
    this.form.get('city')!.setValue(arg.city);
    this.form.get('country')!.setValue(arg.country);
    this.form.get('email')!.setValue(arg.email);
    this.form.get('id')!.setValue(arg.id);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('state')!.setValue(arg.state);
    this.form.markAsUntouched();
  }

}

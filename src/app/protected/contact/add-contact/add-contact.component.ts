import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';

import { ToastService } from 'src/app/providers/toast.service';
import { ContactService } from '../contact.service';
import { BroadcastService } from 'src/app/providers/broadcast.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { CountryService } from 'src/app/providers/country.service';

import { ContactNew } from 'src/app/models/contact-new.model';
import { BroadcastMessage } from 'src/app/models/broadcast-message';
import { Phone } from 'src/app/models/phone.model';
import { Email } from 'src/app/models/email.model';
import { Country } from 'src/app/models/country.model';
import { BillingAddress } from 'src/app/models/billing-address.model';

import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-add-contact',
  styleUrls: ['./add-contact.component.scss'],
  templateUrl: './add-contact.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AddContactComponent implements OnInit, OnDestroy {

  public countries: Country[] = [];
  public countriesCode: Country[] = [];
  public model: ContactNew | any;
  public companyId: string = '';
  public fromQueryParam: string;
  public subscription: Subscription;
  public status: boolean = false;
  public message: string = '';
  public state: boolean = false;
  public saveStatus: boolean = false;
  public messageItem: string = '';
  public phoneNumbers: Phone[] = [];
  public phones: any[] = [];
  public emails: Email[] = [];
  public busy: boolean = false;
  public contactsKey = 'contacts';
  public separateDialCode = true;
  public SearchCountryField = SearchCountryField;

  public CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [CountryISO.Ethiopia, CountryISO.Kenya];

  public form = new FormGroup({
    addressLine1: new FormControl(''),
    addressLine2: new FormControl(''),
    city: new FormControl(''),
    companyId: new FormControl('', [Validators.required]),
    country: new FormControl(''),
    countryISO: new FormControl(''),
    emails: new FormArray([], [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    isActive: new FormControl(true),
    isOrg: new FormControl(false),
    name: new FormControl('', [Validators.required]),
    phoneNumbers: new FormArray([], [Validators.required]),
    state: new FormControl(''),
  });

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private contactService: ContactService,
    private toastService: ToastService,
    private location: Location,
    private broadcastService: BroadcastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private countryService: CountryService,
  ) {
    this.fromQueryParam = this.route.snapshot.queryParamMap.get('from') ?? '';
    this.subscription = this.broadcastService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.companySwitchSender) {
          this.router.navigate(['/protected/contact']);
        }
      });
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.countries = this.countryService.getCountries;
    this.countriesCode = this.countryService.getCountryCodes;
    this.initForm();
  }

  public initForm() {
    this.model = new ContactNew(this.companyId);
    this.form.get('companyId')!.setValue(this.companyId);
    this.setActive(this.model.isActive);
    this.setOrganisation(this.model.isOrg);
    this.phoneNumbers = [];
    this.phones = [];
    this.emails = [];
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

  public setOrganisation(e: any) {
    if (e) {
      this.messageItem = 'Business';
      this.state = true;
    } else {
      this.messageItem = 'Personal';
      this.state = false;
    }
  }

  public addContact(model: ContactNew): Promise<any> {
    return this.contactService.create(model).toPromise();
  }

  public save() {
    this.busy = true;
    this.saveStatus = true;
    for (const p of this.phones) {
      const phoneObj = new Phone();
      phoneObj.dialingCode = Number(p.phone.dialCode.substring(1));
      phoneObj.phone = Number(p.phone.number.replace(/\D/g, ''));
      phoneObj.label = p.label;
      this.phoneNumbers.push(phoneObj);
    }

    this.model = this.form.value as ContactNew;
    this.model.phoneNumbers = this.phoneNumbers;
    this.model.emails = this.emails;
    if (!this.contactService.isModelValid(this.model)) {
      this.toastService.warning(this.messageService.mandatoryFields);
      this.busy = false;
      this.saveStatus = false;
      return;
    }

    this.addContact(this.model).then((res) => {
      this.toastService.success(this.messageService.operationSuccesful);
      this.saveStatus = false;
      if (this.fromQueryParam !== null) {
        const data = this.storageService.getData(this.contactsKey);
        if (data) {
          let dataArray = [];
          dataArray = data;
          if (this.fromQueryParam === 'protected/customer/edit') {
            const billingAddress = new BillingAddress();
            billingAddress.contact = res;
            dataArray.push(billingAddress);
          } else {
            dataArray.push(res);
          }
          this.storageService.setData(this.contactsKey, dataArray);
        } else {
          this.storageService.setData(this.contactsKey, res);
        }
      }
    }, (reject) => {
      this.toastService.error(reject);
      this.saveStatus = false;
      this.busy = false;
    })
      .catch((error) => {
        this.toastService.error(error);
        this.saveStatus = false;
        this.busy = false;
      })
      .finally(() => {
        this.busy = false;
        this.saveStatus = false;
      });
  }

  public goBack() {
    if (this.fromQueryParam && this.fromQueryParam !== '') {
      // this.router.navigate([this.fromQueryParam.trim()]);
      this.router.navigate([this.fromQueryParam.trim()], {
        queryParams: { from: 'protected/contact/add' },
      });
    } else {
      this.location.back();
    }
  }

  public addPhone() {
    const pho: any = {};
    const obj = { phone: pho, label: '' };
    this.phones.push(obj);
  }

  public deletePhone(index: number) {
    this.phones.splice(index, 1);
  }

  public addEmail() {
    this.emails.push(new Email());
  }

  public deleteEmail(index: number) {
    this.emails.splice(index, 1);
  }

}

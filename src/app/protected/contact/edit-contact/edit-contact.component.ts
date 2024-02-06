import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

import { ToastService } from 'src/app/providers/toast.service';
import { ContactService } from '../contact.service';
import { StorageService } from 'src/app/providers/storage.service';
import { MessageService } from 'src/app/providers/message.service';
import { CountryService } from 'src/app/providers/country.service';

import { Contact } from 'src/app/models/contact.model';
import { Phone } from 'src/app/models/phone.model';
import { Country } from 'src/app/models/country.model';
import { Email } from 'src/app/models/email.model';
import { Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-edit-contact',
  styleUrls: ['./edit-contact.component.scss'],
  templateUrl: './edit-contact.component.html',
})

export class EditContactComponent implements OnInit {

  public countries: Country[] = [];
  public countriesCode: Country[] = [];
  public model: Contact;
  public status: boolean = false;
  public message: string = '';
  public state: boolean = false;
  public messageItem: string = '';
  public phoneNumbers: Phone[] = [];
  public emails: Email[] = [];
  public emailsUnchanged: Email[] = [];
  public busy: boolean = false;
  public saveStatus: boolean = false;
  public phones: any[] = [];
  public phonesUnchanged: any[] = [];
  public phoneNumbersUnchanged: Phone[] = [];
  public separateDialCode = true;
  public SearchCountryField = SearchCountryField;

  public CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [CountryISO.Ethiopia, CountryISO.Kenya];

  public form = new FormGroup({
    addressLine1: new FormControl(''),
    addressLine2: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
    countryISO: new FormControl(''),
    emails: new FormArray([], [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    id: new FormControl('', [Validators.required]),
    isActive: new FormControl(true),
    isOrg: new FormControl(false),
    name: new FormControl('', [Validators.required]),
    phoneNumbers: new FormArray([], [Validators.required]),
    state: new FormControl(''),
  });

  constructor(
    private contactService: ContactService,
    private toastService: ToastService,
    private storageService: StorageService,
    private messageService: MessageService,
    private countryService: CountryService,
    public route: Router,
  ) {
    this.model = this.storageService.getData('data');

    if (this.model) {
      this.populateData(this.model);
    }
  }

  public ngOnInit() {
    this.setActive(this.model.isActive);
    this.setOrganisation(this.model.isOrg);
    this.countries = this.countryService.getCountries;
    this.countriesCode = this.countryService.getCountryCodes;
  }

  public update(model: Contact): Promise<any> {
    return this.contactService.update(model).toPromise();
  }

  public save() {
    this.busy = true;
    this.saveStatus = true;
    this.model = this.form.value as Contact;
    // this.model.phoneNumbers = this.phoneNumbers;
    this.model.emails = this.emails;

    for (const p of this.phones) {
      const phoneObj = new Phone();
      phoneObj.dialingCode = Number(p.phone.dialCode.substring(1));
      phoneObj.phone = Number(p.phone.number.replace(/\D/g, ''));
      phoneObj.label = p.label;
      this.phoneNumbers.push(phoneObj);
    }
    this.model.phoneNumbers = this.phoneNumbers;

    if (this.model && this.model.name.trim() === '' ||
      !this.model.emails || this.model.emails.length === 0) {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.update(this.model).then((response: Contact) => {
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
      this.messageItem = 'Personal ';
      this.state = false;
    }
  }

  public goBack() {
    this.route.navigate(['protected/contact']);
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

  get emailChanged() {
    return ((this.emailsUnchanged.length !== this.emails.length) ||
      (JSON.stringify(this.emailsUnchanged) !== JSON.stringify(this.emails)));
  }

  get phoneChanged() {
    for (const p of this.phones) {
      if (p.phone) {
        const phoneObj = new Phone();
        phoneObj.dialingCode = Number(p.phone.dialCode.substring(1));
        phoneObj.phone = Number(p.phone.number.replace(/\D/g, ''));
        phoneObj.label = p.label;
        this.phoneNumbers.push(phoneObj);
      }
    }
    for (const p of this.phonesUnchanged) {
      const phoneObj = new Phone();
      phoneObj.dialingCode = Number(p.phone.dialCode);
      phoneObj.phone = Number(p.phone.number);
      phoneObj.label = p.label;
      this.phoneNumbersUnchanged.push(phoneObj);
    }
    return ((this.model.phoneNumbers.length !== this.phones.length) ||
      (JSON.stringify(this.phoneNumbers) !== JSON.stringify(this.phoneNumbersUnchanged)));
  }

  public populateData(arg: Contact) {
    this.phones = [];
    this.phonesUnchanged = [];
    this.phoneNumbers = [];
    this.phoneNumbersUnchanged = [];
    this.emails = arg.emails;
    // copy without reference
    this.emailsUnchanged = _.cloneDeep(arg.emails);
    if (arg.phoneNumbers && arg.phoneNumbers.length > 0) {
      for (const phone of arg.phoneNumbers) {
        const pho: any = {};
        pho.dialCode = phone.dialingCode;
        pho.number = phone.phone.toString();
        const obj = { phone: pho, label: phone.label };
        const obj2 = { phone: pho, label: phone.label };
        this.phones.push(obj);
        this.phonesUnchanged.push(obj2);
      }
    }
    this.form.get('id')!.setValue(arg.id);
    this.form.get('name')!.setValue(arg.name);
    this.form.get('gender')!.setValue(arg.gender);
    this.form.get('addressLine1')!.setValue(arg.addressLine1);
    this.form.get('addressLine2')!.setValue(arg.addressLine2);
    this.form.get('city')!.setValue(arg.city);
    this.form.get('state')!.setValue(arg.state);
    this.form.get('country')!.setValue(arg.country);
    this.form.get('countryISO')!.setValue(arg.countryISO);
    this.form.get('isActive')!.setValue(arg.isActive);
    this.form.get('isOrg')!.setValue(arg.isOrg);
  }
}

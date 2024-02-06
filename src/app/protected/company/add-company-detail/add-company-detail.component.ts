import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

import { CompanyDetailService } from '../company-detail.service';
import { StorageService } from 'src/app/providers/storage.service';
import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';
import { CountryService } from 'src/app/providers/country.service';

import { CompanyDetailNew } from 'src/app/models/company-detail-new.model';
import { Country } from 'src/app/models/country.model';

@Component({
  selector: 'app-add-company-detail',
  styleUrls: ['./add-company-detail.component.scss'],
  templateUrl: './add-company-detail.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class AddCompanyDetailComponent implements OnInit {

  public countries: Country[] = [];
  public model: CompanyDetailNew | any;
  public companyId: string = '';
  public busy: boolean = false;
  public phone: any;
  public separateDialCode = true;
  public SearchCountryField = SearchCountryField;
  
  public CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [CountryISO.Ethiopia, CountryISO.Kenya];

  public form = new FormGroup({
    'companyId': new FormControl('', [Validators.required]),
    'tin': new FormControl('', [Validators.required]),
    'email': new FormControl(null, [Validators.required]),
    'website': new FormControl(''),
    'dialingCode': new FormControl(null),
    'phone': new FormControl(''),
    'addressLine1': new FormControl(''),
    'addressLine2': new FormControl(''),
    'country': new FormControl(''),
    'state': new FormControl(''),
    'city': new FormControl(''),
  });

  constructor(
    private location: Location,
    private companyDetailService: CompanyDetailService,
    private storageService: StorageService,
    private toastService: ToastService,
    private messageService: MessageService,
    private countryService: CountryService,
  ) {
    this.initForm();
  }

  public ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.form.get('companyId')!.setValue(this.companyId);
  }

  public initForm() {
    this.model = new CompanyDetailNew(this.companyId);
    this.countries = this.countryService.getCountries;
  }

  public goBack() {
    this.location.back();
  }

  public addCompanyDetail(companyDetail: CompanyDetailNew): Promise<any> {
    return this.companyDetailService.create(companyDetail).toPromise();
  }

  public save() {
    this.busy = true;
    this.model = this.form.value as CompanyDetailNew;
    this.model.dialingCode = this.phone.dialCode.substring(1);
    this.model.phone = this.phone.number.replace(/\D/g, '');
    if (this.model && this.model.tin.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.addCompanyDetail(this.model).then(() => {
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
}

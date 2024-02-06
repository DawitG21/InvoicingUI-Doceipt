import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

import { StorageService } from 'src/app/providers/storage.service';
import { CompanyDetailService } from '../company-detail.service';
import { ToastService } from 'src/app/providers/toast.service';
import { MessageService } from 'src/app/providers/message.service';
import { CountryService } from 'src/app/providers/country.service';

import { CompanyDetail } from 'src/app/models/company-detail.model';
import { Country } from 'src/app/models/country.model';
import { Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-edit-company-detail',
  styleUrls: ['./edit-company-detail.component.scss'],
  templateUrl: './edit-company-detail.component.html',
})
export class EditCompanyDetailComponent implements OnInit {

  public companyId: string = '';
  public countries: Country[] = [];
  public model: CompanyDetail;
  public busy: boolean = false;
  public phone: any = {};
  public separateDialCode = true;
  public SearchCountryField = SearchCountryField;
  
  public CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [CountryISO.Ethiopia, CountryISO.Kenya];

  public form = new FormGroup({
    'id': new FormControl('', [Validators.required]),
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
    private storageService: StorageService,
    private companyDetailService: CompanyDetailService,
    private toastService: ToastService,
    private messageService: MessageService,
    private countryService: CountryService,
    public route: Router,
  ) {
    this.model = this.storageService.getData('data');
    this.phone.dialCode = this.model.dialingCode;
    this.phone.number = this.model.phone;
    if (this.model) {
      this.populateData(this.model);
    }

  }

  public ngOnInit() {
    this.companyId = this.storageService.getCompanyId;
    this.countries = this.countryService.getCountries;
  }

  public goBack() {
    this.route.navigate(['/protected/company'], { queryParams: { id: this.companyId } });
  }

  public editCompanyDetail(companyDetail: CompanyDetail) {
    return this.companyDetailService.update(companyDetail).toPromise();
  }

  public save() {
    this.busy = true;
    this.model = this.form.value as CompanyDetail;
    this.model.dialingCode = this.phone.dialCode.substring(1);
    this.model.phone = this.phone.number.replace(/\D/g, '');
    if (this.model && this.model.tin.trim() === '') {
      this.toastService.warning(this.messageService.mandatoryFields);
      return;
    }

    this.editCompanyDetail(this.model).then((response: CompanyDetail) => {
      this.populateData(response);
      this.model = response;
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

  get phoneChanged() {
    if ((this.model.dialingCode !== Number(this.phone.dialCode.substring(1))) ||
      (this.model.phone !== this.phone.number.replace(/\D/g, ''))) {
      return true;
    } else {
      return false;
    }
  }

  public populateData(arg: CompanyDetail) {
    this.form.get('id')!.setValue(arg.id);
    this.form.get('tin')!.setValue(arg.tin);
    this.form.get('email')!.setValue(arg.email);
    this.form.get('website')!.setValue(arg.website);
    this.form.get('addressLine1')!.setValue(arg.addressLine1);
    this.form.get('addressLine2')!.setValue(arg.addressLine2);
    this.form.get('country')!.setValue(arg.country);
    this.form.get('state')!.setValue(arg.state);
    this.form.get('city')!.setValue(arg.city);
    this.form.markAsUntouched();
  }

}

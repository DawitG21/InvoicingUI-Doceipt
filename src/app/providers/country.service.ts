import { Injectable } from '@angular/core';

import { Country } from 'src/app/models/country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {

  private countries: Country[] = [
    { name: 'Ethiopia', value: 'Ethiopia' },
    { name: 'Kenya', value: 'Kenya' },
    { name: 'Nigeria', value: 'Nigeria' },
    { name: 'Somalia', value: 'Somalia' },
  ];

  private countryCodes: Country[] = [
    { name: 'ET', value: 'ET' },
    { name: 'KE', value: 'KE' },
    { name: 'NG', value: 'NG' },
    { name: 'SO', value: 'SO' },
  ];

  constructor() { }

  get getCountries() {
    return this.countries;
  }

  get getCountryCodes() {
    return this.countryCodes;
  }
}

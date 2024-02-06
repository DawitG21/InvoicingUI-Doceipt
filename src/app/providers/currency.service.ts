import { Injectable } from '@angular/core';

declare var require: any;

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {

  private currencies: string[] = [];

  constructor() { }

  get getCurrencies() {
    const cc = require('currency-codes');
    this.currencies = cc.codes();
    return this.currencies;
  }
}

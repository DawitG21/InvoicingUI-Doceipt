import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(
    private spinner: NgxSpinnerService
  ) { }

  show(name?: string, spinner?: any) {
    return this.spinner.show(name, spinner);
  }

  hide(name?: string) {
    return this.spinner.hide(name);
  }

  getSpinner(name: string) {
    return this.spinner.getSpinner(name);
  }
}

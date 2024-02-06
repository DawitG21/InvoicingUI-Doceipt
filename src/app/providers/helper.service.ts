import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  readonly date = new Date();

  constructor(
    private location: Location
  ) { }

  private padToTwoDigits(arg: string) {
    if (arg.length < 2) {
      arg = `0${arg}`;
    }
    return arg;
  }

  /**
   * Returns UTC Date in yyyy-MM-dd format
   * @param date A Date type
   */
  getUTCDateString(date: Date) {
    const month = this.padToTwoDigits(`${date.getUTCMonth() + 1}`);
    const day = this.padToTwoDigits(`${date.getUTCDate()}`);

    return `${date.getUTCFullYear()}-${month}-${day}`;
  }

  get getUTCDateNewString() {
    const month = this.padToTwoDigits(`${this.date.getUTCMonth() + 1}`);
    const day = this.padToTwoDigits(`${this.date.getUTCDate()}`);

    return `${this.date.getUTCFullYear()}-${month}-${day}`;
  }

  /**
   * Returns Date in yyyy-MM-dd format
   * @param date A Date type
   */
  getDateString(date: Date) {
    const month = this.padToTwoDigits(`${date.getMonth() + 1}`);
    const day = this.padToTwoDigits(`${date.getDate()}`);

    return `${date.getFullYear()}-${month}-${day}`;
  }

  getDate(dateString: string) {
    return new Date(dateString);
  }

  get getDateToISOString() {
    return this.date.toISOString();
  }

  get getTimezoneOffset(): string {
    const offset = this.date.getTimezoneOffset();
    const hh = -offset / 60;
    const mm = -offset % 60;
    const offsetSign = offset.toString().indexOf('-') > -1 ? '+' : '';

    return `${offsetSign}${hh}:${mm}`;
  }

  get getDateNewString() {
    const month = this.padToTwoDigits(`${this.date.getMonth() + 1}`);
    const day = this.padToTwoDigits(`${this.date.getDate()}`);

    return `${this.date.getFullYear()}-${month}-${day}`;
  }

  getActiveColor(isActive: boolean): string {
    if (isActive) {
      return 'text-success';
    }
    return 'text-danger';
  }

  getFileUrl(filename: string) {
    const loc: any = this.location;
    const platform = loc._platformStrategy;
    return `${platform._platformLocation.location.origin}${platform._baseHref}${filename}`;
  }

  get getAppLogo() {
    return this.getFileUrl('favicon.png');
  }
}

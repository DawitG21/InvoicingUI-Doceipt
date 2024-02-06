import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  readonly keyCompanyId = 'doceipt.companyId';

  setData(property: string, data: any) {
    localStorage.setItem(`doceipt.${property}`, JSON.stringify(data));
  }

  getData(property: string) {
    let data = localStorage.getItem(`doceipt.${property}`) ?? '';
    if (data) {
      return JSON.parse(data);
    }
    // return JSON.parse(localStorage.getItem(`doceipt.${property}`) ?? '');
  }

  deleteData(property: string) {
    localStorage.removeItem(`doceipt.${property}`);
  }

  setCompanyId(companyId: string) {
    return localStorage.setItem(this.keyCompanyId, companyId);
  }

  get getCompanyId() {
    return localStorage.getItem(this.keyCompanyId) ?? '';
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResourceEndpointService } from 'src/app/endpoints/resource-endpoint.service';
import { HttpService } from 'src/app/providers/http.service';

import { Invoice } from 'src/app/models/invoice.model';
import { InvoiceNew } from 'src/app/models/invoice-new.model';
import { InvoiceSearchModel } from 'src/app/models/invoice-search.model';

import { AuthService } from '../../core/authentication/auth.service';
import { ProtectedService } from '../protected.service';
import { BaseService } from 'src/app/shared/base.service';
import { Tax } from 'src/app/models/tax.model';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService extends BaseService {

  accessToken = '';
  httpOptions: any;
  total = 0;

  constructor(
    private http: HttpService,
    private resEndpoint: ResourceEndpointService,
    private authService: AuthService,
    private protectedService: ProtectedService
  ) {
    super();
    this.httpOptions = this.protectedService.getHttpOptions(this.authService.authorizationHeaderValue);
  }

  get(id: string): Observable<Invoice> {
    return this.http.get(this.resEndpoint.InvoiceGetUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  create(newInvoice: InvoiceNew): Observable<Invoice> {
    return this.http.post(this.resEndpoint.InvoiceUri, newInvoice, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  search(id: string, searchObj: any): Observable<any> {
    return this.http.post(this.resEndpoint.InvoiceSearchUri(id), searchObj, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  searchInvoice(companyId: string, model: InvoiceSearchModel, page: number,
    pageSize: number, sortOrder: string, href?: string): Observable<any> {
    let searchUrl: string;
    if (href) {
      searchUrl = href;
    } else {
      const baseUrl = this.resEndpoint.InvoiceUri;
      searchUrl = `${baseUrl}/${companyId}/search?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`;
    }
    return this.http.post(searchUrl, model, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  delete(id: string): Observable<Invoice[]> {
    return this.http.delete(this.resEndpoint.InvoiceDeleteUri(id), this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  void(id: string): Observable<any> {
    return this.http.delete(`${this.resEndpoint.InvoiceUri}/${id}/void`, this.httpOptions)
      .pipe(map((response: any) => response), catchError(this.handleError));
  }

  createModifiedObjects(allServiceFees: any) {
    const serviceFees = [];
    for (let i = 0; i < allServiceFees.length; i++) {
      const newServiceFee: any = {
        'id': '',
        'name': '',
        'description': '',
        'amount': 0,
        'currency': '',
        'taxInclusive': false,
        'customerGroup': {},
        'paymentCycle': {},
        'service': {},
        'invoiceFee': {
          'serviceFeeId': '',
          'quantity': 1,
          'discounts': [],
          'discountedAmounts': []
        },
        'totalAmount': 0,
        'amountAfterDiscount': 0,
        'netDiscounts': [],
        'amountAfterQuantity': 0,
        'totalTaxes': 0,
        'taxes': [],
        'amountAfterTax': 0,
        'amountAfterTaxDiscountAndQuantity': 0,
        'netTaxes': [],
        'checked': false
      };
      let counter = 0;
      newServiceFee.id = allServiceFees[i].id;
      newServiceFee.name = allServiceFees[i].name;
      newServiceFee.description = allServiceFees[i].description;
      newServiceFee.amount = allServiceFees[i].amount;
      newServiceFee.currency = allServiceFees[i].currency;
      newServiceFee.taxInclusive = allServiceFees[i].taxInclusive;
      newServiceFee.customerGroup = allServiceFees[i].customerGroup;
      newServiceFee.paymentCycle = allServiceFees[i].paymentCycle;
      newServiceFee.service = allServiceFees[i].service;
      if (allServiceFees[i].service.mandatory === true) {
        newServiceFee.checked = true;
      }
      newServiceFee.taxes = allServiceFees[i].taxes;
      newServiceFee.amountAfterQuantity = newServiceFee.amount * newServiceFee.invoiceFee.quantity;
      if (newServiceFee.taxInclusive === false) { // Tax Exclusive
        if (newServiceFee.taxes.length === 0) { // Tax Exclusive with No Tax
          newServiceFee.totalAmount = newServiceFee.amountAfterQuantity;
          newServiceFee.amountAfterDiscount = newServiceFee.totalAmount;
        }
        if (newServiceFee.taxes.length !== 0) { // Tax Exclusive with Tax
          newServiceFee.totalAmount = newServiceFee.amountAfterQuantity;
          newServiceFee.amountAfterDiscount = newServiceFee.amountAfterQuantity;
          for (let j = 0; j < newServiceFee.taxes.length; j++) {
            newServiceFee.totalTaxes = newServiceFee.totalTaxes + newServiceFee.taxes[j].percentValue;
          }
          for (let j = 0; j < newServiceFee.taxes.length; j++) {
            newServiceFee.netTaxes[j] = (newServiceFee.amountAfterDiscount
              * (newServiceFee.taxes[j].percentValue / 100));
          }
          /* calculate Total Amount after finding out the tax prices */
          for (let k = 0; k < newServiceFee.netTaxes.length; k++) {
            newServiceFee.totalAmount = newServiceFee.totalAmount + newServiceFee.netTaxes[k];
          }
        }
      }
      if (newServiceFee.taxInclusive === true) { // Tax Inclusive
        for (let j = 0; j < newServiceFee.taxes.length; j++) {
          newServiceFee.totalTaxes = newServiceFee.totalTaxes + newServiceFee.taxes[j].percentValue;
        }
        newServiceFee.amountAfterTax = newServiceFee.amountAfterQuantity / (1 + newServiceFee.totalTaxes / 100);
        newServiceFee.amountAfterTaxDiscountAndQuantity = newServiceFee.amountAfterTax;
        newServiceFee.amountAfterDiscount = newServiceFee.amountAfterTax;
        newServiceFee.totalAmount = newServiceFee.amountAfterQuantity;
        for (let j = 0; j < newServiceFee.taxes.length; j++) {
          newServiceFee.netTaxes[j] = (newServiceFee.amountAfterTaxDiscountAndQuantity
            * (newServiceFee.taxes[j].percentValue / 100));
        }
      }
      /* Push the new servicefee object into ServiceFees array */
      for (let k = 0; k < serviceFees.length; k++) {
        if (serviceFees[k].id === newServiceFee.id) {
          counter = 1;
        }
      }
      if (counter === 0) {
        serviceFees.push(newServiceFee);
      }
    }
    return serviceFees;
  }

  calculateDiscounts(serviceFees: Array<any>) {
    for (let i = 0; i < serviceFees.length; i++) {
      if (serviceFees[i].taxInclusive === true) {
        if (serviceFees[i].invoiceFee.discounts.length === 1) {

        } else {
          for (let k = 0; k < serviceFees[i].invoiceFee.discounts.length; k++) {
            let prevDiscounts = 0;
            for (let j = 0; j < serviceFees[i].invoiceFee.discountedAmounts.length; j++) {
              prevDiscounts = prevDiscounts + serviceFees[i].invoiceFee.discountedAmounts[j];
            }
            serviceFees[i].invoiceFee.discountedAmounts[k] = ((serviceFees[i].amountAfterTax - prevDiscounts)
              * (serviceFees[i].invoiceFee.discounts[k] / 100));
            serviceFees[i].netDiscounts[k] = serviceFees[i].amountAfterQuantity
              - serviceFees[i].invoiceFee.discountedAmounts[k];
          }
        }
        let taxInclusiveDiscounts = 0;
        for (let k = 0; k < serviceFees[i].invoiceFee.discountedAmounts.length; k++) {
          taxInclusiveDiscounts = taxInclusiveDiscounts + serviceFees[i].invoiceFee.discountedAmounts[k];
        }
        serviceFees[i].amountAfterDiscount = (serviceFees[i].amountAfterTax - taxInclusiveDiscounts);
        serviceFees[i].amountAfterTaxDiscountAndQuantity = serviceFees[i].amountAfterTax;
        serviceFees[i].amountAfterTaxDiscountAndQuantity = serviceFees[i].amountAfterTaxDiscountAndQuantity
          - taxInclusiveDiscounts;
        this.calculateTax(serviceFees[i]);
        let totalNetTaxes = 0;
        for (let j = 0; j < serviceFees[i].netTaxes.length; j++) {
          totalNetTaxes += serviceFees[i].netTaxes[j];
        }
        serviceFees[i].totalAmount = serviceFees[i].amountAfterDiscount + totalNetTaxes;
        serviceFees[i] = this.calculateTax(serviceFees[i]);
        serviceFees = this.calculateTotal(serviceFees);
      } else {
        if (serviceFees[i].taxes.length === 0) {
          // new added
          if (serviceFees[i].invoiceFee.discounts.length === 1) {
            serviceFees[i].invoiceFee.discountedAmounts[0] = (
              (serviceFees[i].amountAfterQuantity)
              * serviceFees[i].invoiceFee.discounts[0] / 100);
          } else {
            for (let k = 0; k < serviceFees[i].invoiceFee.discounts.length; k++) {
              let prevDiscounts = 0;
              for (let j = 0; j < serviceFees[i].invoiceFee.discountedAmounts.length; j++) {
                prevDiscounts = prevDiscounts + serviceFees[i].invoiceFee.discountedAmounts[j];
              }
              serviceFees[i].invoiceFee.discountedAmounts[k] = (
                (serviceFees[i].amountAfterQuantity - prevDiscounts)
                * serviceFees[i].invoiceFee.discounts[k] / 100);
            }
          }

          for (let j = 0; j < serviceFees[i].invoiceFee.discountedAmounts.length; j++) {
            let discounts = 0;
            for (let k = 0; k < serviceFees[i].invoiceFee.discountedAmounts.length; k++) {
              discounts = discounts + serviceFees[i].invoiceFee.discountedAmounts[k];
            }
            serviceFees[i].amountAfterDiscount = serviceFees[i].amountAfterQuantity - discounts;
            for (let k = 0; k < serviceFees[i].invoiceFee.discountedAmounts.length; k++) {
              serviceFees[i].netDiscounts[k] = serviceFees[i].amountAfterQuantity - discounts;
            }
            serviceFees[i].totalAmount = serviceFees[i].amountAfterQuantity - discounts;
            serviceFees = this.calculateTotal(serviceFees);
          }
        } else {
          let taxexlusivediscounts = 0;
          if (serviceFees[i].invoiceFee.discounts.length === 1) {
            serviceFees[i].invoiceFee.discountedAmounts[0] = (
              (serviceFees[i].amountAfterQuantity)
              * (serviceFees[i].invoiceFee.discounts[0] / 100));
            serviceFees[i].netDiscounts[0] = serviceFees[i].amountAfterQuantity
              - serviceFees[i].invoiceFee.discountedAmounts[0];
          } else {
            for (let k = 0; k < serviceFees[i].invoiceFee.discounts.length; k++) {
              let prevDiscounts = 0;
              for (let j = 0; j < serviceFees[i].invoiceFee.discountedAmounts.length; j++) {
                prevDiscounts = prevDiscounts + serviceFees[i].invoiceFee.discountedAmounts[j];
              }
              serviceFees[i].invoiceFee.discountedAmounts[k] = (
                (serviceFees[i].amountAfterQuantity - prevDiscounts)
                * (serviceFees[i].invoiceFee.discounts[k] / 100));
              serviceFees[i].netDiscounts[k] = serviceFees[i].amountAfterQuantity
                - serviceFees[i].invoiceFee.discountedAmounts[k];
            }
          }

          for (let k = 0; k < serviceFees[i].invoiceFee.discountedAmounts.length; k++) {
            taxexlusivediscounts = taxexlusivediscounts + serviceFees[i].invoiceFee.discountedAmounts[k];
          }
          serviceFees[i].amountAfterDiscount = (serviceFees[i].amountAfterQuantity - taxexlusivediscounts);
          serviceFees[i] = this.calculateTax(serviceFees[i]);
          serviceFees[i].totalAmount = serviceFees[i].amountAfterDiscount;
          for (let k = 0; k < serviceFees[i].netTaxes.length; k++) {
            serviceFees[i].totalAmount = serviceFees[i].totalAmount + serviceFees[i].netTaxes[k];
          }
          serviceFees = this.calculateTotal(serviceFees);
        }
      }

    }
    return serviceFees;
  }

  calculateTax(obj: {
    taxInclusive: boolean; amountAfterTax: number; amountAfterQuantity: number;
    totalTaxes: number; taxes: { percentValue: number; }[]; netTaxes: number[];
    amountAfterTaxDiscountAndQuantity: number; amountAfterDiscount: number;
  }) {
    if (obj.taxInclusive === true) {
      obj.amountAfterTax = obj.amountAfterQuantity / (1 + obj.totalTaxes / 100);
      for (let j = 0; j < obj.taxes.length; j++) {
        obj.netTaxes[j] = (obj.amountAfterTaxDiscountAndQuantity * (obj.taxes[j].percentValue / 100));
      }
    } else {
      for (let j = 0; j < obj.taxes.length; j++) {
        obj.netTaxes[j] = (obj.amountAfterDiscount
          * (obj.taxes[j].percentValue / 100));
      }
    }
    return obj;
  }

  calculateTotal(serviceFees: Array<any>) {
    let total = 0;
    for (let i = 0; i < serviceFees.length; i++) {
      total = total + serviceFees[i].totalAmount;
    }
    return serviceFees;
  }

  invoicePreview(serviceFees: any, invoice: any) {
    let allServiceFees = [];
    let serviceFeeData = [];
    let invoiceObject: any = {};

    allServiceFees = this.createModifiedObjects(serviceFees);
    for (let j = 0; j < allServiceFees.length; j++) {
      for (let k = 0; k < invoice.invoiceFees.length; k++) {
        if (allServiceFees[j].service.id === invoice.invoiceFees[k].service.id) {
          for (let x = 0; x < invoice.invoiceFees[k].discounts.length; x++) {
            allServiceFees[j].invoiceFee.discounts.push(invoice.invoiceFees[k].discounts[x].percentValue);
          }
          allServiceFees[j].invoiceFee.quantity = invoice.invoiceFees[k].quantity;
        }
      }
    }
    serviceFeeData = this.calculateDiscounts(allServiceFees);
    const newInvoiceObject = {
      'invoice': invoice,
      'data': serviceFeeData
    };
    invoiceObject = newInvoiceObject;
    return invoiceObject;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class InvoiceCalculationsService {

  serviceFees: Array<any> = [];

  constructor() { }

  updateQuantity(obj: {
    taxInclusive: any; amountAfterTax: any; amountAfterQuantity: any;
    totalTaxes: any; taxes: any; netTaxes: any; amountAfterTaxDiscountAndQuantity: any;
    amountAfterDiscount: any; amount?: any; invoiceFee?: any; totalAmount?: any;
  }, serviceFees: Array<any>) {
    this.serviceFees = serviceFees;
    obj.amountAfterQuantity = obj.amount * obj.invoiceFee.quantity;
    if (obj.taxInclusive === true) {
      obj.amountAfterTax = obj.amountAfterQuantity / (1 + obj.totalTaxes / 100);
      if (obj.invoiceFee.discounts.length === 0) {
        obj.amountAfterTaxDiscountAndQuantity = obj.amountAfterTax;
        obj.totalAmount = obj.amountAfterQuantity;
        this.calculateTax(obj);
      } else {
        this.calculateDiscountAfterQty(obj);
      }
    } else {
      if (obj.taxes.length === 0) {
        if (obj.invoiceFee.discounts.length === 0) {
          obj.totalAmount = obj.amountAfterQuantity;
        } else {
          this.calculateDiscountAfterQty(obj);
        }
      } else {
        if (obj.invoiceFee.discounts.length === 0) {
          obj.amountAfterDiscount = obj.amountAfterQuantity;
          this.calculateTax(obj);
          obj.totalAmount = obj.amountAfterQuantity;
          for (let k = 0; k < obj.netTaxes.length; k++) {
            obj.totalAmount = obj.totalAmount + obj.netTaxes[k];
          }
        } else {
          this.calculateDiscountAfterQty(obj);
        }
      }
    }
    return obj;
  }

  addDiscounts(obj: {
    invoiceFee: {
      discounts: number[]; discountedAmounts: number[];
      serviceFeeId: any;
    }; id: any; netDiscounts: number[];
  }) {
    const discount = 0;
    const discountedAmount = 0;
    const netDiscount = 0;
    obj.invoiceFee.discounts.push(discount);
    obj.invoiceFee.discountedAmounts.push(discountedAmount);
    obj.invoiceFee.serviceFeeId = obj.id;
    obj.netDiscounts.push(netDiscount);
    for (let i = 0; i < this.serviceFees.length; i++) {
      if (obj.id === this.serviceFees[i].id) {
        this.serviceFees[i] = obj;
      }
    }
  }

  deleteDiscount(obj: any, index: any) {
    obj.invoiceFee.discounts.splice(index, 1);
    obj.invoiceFee.discountedAmounts.splice(index, 1);
    this.updateQuantity(obj, this.serviceFees);
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
  }

  calculateDiscountAfterQty(obj: {
    taxInclusive?: any; amountAfterTax?: any; amountAfterQuantity?: any;
    totalTaxes?: any; taxes?: any; netTaxes?: any; amountAfterTaxDiscountAndQuantity?: any;
    amountAfterDiscount?: any; amount?: any; invoiceFee?: any; totalAmount?: any; id?: any;
  }) {

    for (let i = 0; i < this.serviceFees.length; i++) {
      if (obj.id === this.serviceFees[i].id) {
        for (let j = 0; j < this.serviceFees[i].invoiceFee.discounts.length; j++) {
          let previousDiscounts = 0;
          for (let k = 0; k < j; k++) {
            previousDiscounts = previousDiscounts + this.serviceFees[i].invoiceFee.discountedAmounts[k];
          }
          if (this.serviceFees[i].taxInclusive === true) {
            let taxInclusiveDiscounts = 0;
            this.serviceFees[i].invoiceFee.discountedAmounts[j] = (
              (this.serviceFees[i].amountAfterTax - previousDiscounts) * (this.serviceFees[i].invoiceFee.discounts[j] / 100));
            this.serviceFees[i].netDiscounts[j] = this.serviceFees[i].amountAfterQuantity
              - this.serviceFees[i].invoiceFee.discountedAmounts[j];
            for (let k = 0; k < this.serviceFees[i].invoiceFee.discountedAmounts.length; k++) {
              taxInclusiveDiscounts = taxInclusiveDiscounts + this.serviceFees[i].invoiceFee.discountedAmounts[k];
            }
            this.serviceFees[i].amountAfterDiscount = (this.serviceFees[i].amountAfterTax - taxInclusiveDiscounts);
            this.serviceFees[i].amountAfterTaxDiscountAndQuantity = this.serviceFees[i].amountAfterTax;
            this.serviceFees[i].amountAfterTaxDiscountAndQuantity = this.serviceFees[i].amountAfterTaxDiscountAndQuantity
              - taxInclusiveDiscounts;
            this.calculateTax(this.serviceFees[i]);
            let totalDiscounts = 0;
            for (let x = 0; x < this.serviceFees[i].invoiceFee.discounts.length; x++) {
              totalDiscounts = totalDiscounts + this.serviceFees[i].invoiceFee.discountedAmounts[x];
            }
            this.serviceFees[i].totalAmount = this.serviceFees[i].amountAfterQuantity - totalDiscounts;
          } else {
            if (this.serviceFees[i].taxes.length === 0) {
              this.serviceFees[i].invoiceFee.discountedAmounts[j] = (
                (this.serviceFees[i].amountAfterQuantity - previousDiscounts)
                * this.serviceFees[i].invoiceFee.discounts[j] / 100);
              for (let y = 0; y < this.serviceFees[i].invoiceFee.discountedAmounts.length; y++) {
                let discounts = 0;
                for (let k = 0; k < this.serviceFees[i].invoiceFee.discountedAmounts.length; k++) {
                  discounts = discounts + this.serviceFees[i].invoiceFee.discountedAmounts[k];
                }
                this.serviceFees[i].amountAfterDiscount = this.serviceFees[i].amountAfterQuantity - discounts;
                this.serviceFees[i].netDiscounts[y] = this.serviceFees[i].amountAfterQuantity - discounts;
                this.serviceFees[i].totalAmount = this.serviceFees[i].amountAfterQuantity - discounts;
              }
            } else {
              let taxExclusiveDiscounts = 0;
              this.serviceFees[i].invoiceFee.discountedAmounts[j] = (
                (this.serviceFees[i].amountAfterQuantity - previousDiscounts)
                * (this.serviceFees[i].invoiceFee.discounts[j] / 100));
              this.serviceFees[i].netDiscounts[j] = this.serviceFees[i].amountAfterQuantity
                - this.serviceFees[i].invoiceFee.discountedAmounts[j];
              for (let k = 0; k < this.serviceFees[i].invoiceFee.discountedAmounts.length; k++) {
                taxExclusiveDiscounts = taxExclusiveDiscounts + this.serviceFees[i].invoiceFee.discountedAmounts[k];
              }
              this.serviceFees[i].amountAfterDiscount = (this.serviceFees[i].amountAfterQuantity - taxExclusiveDiscounts);
              this.calculateTax(this.serviceFees[i]);
              this.serviceFees[i].totalAmount = this.serviceFees[i].amountAfterDiscount;
              for (let k = 0; k < this.serviceFees[i].netTaxes.length; k++) {
                this.serviceFees[i].totalAmount = this.serviceFees[i].totalAmount + this.serviceFees[i].netTaxes[k];
              }
            }
          }
        }
      }
    }
  }
}

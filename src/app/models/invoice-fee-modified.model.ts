import { CustomerGroup } from './customer-group.model';
import { PaymentCycle } from './payment-cycle.model';
import { Service } from './service.model';

export class InvoiceFeeModified {
    id: string;
    name: string;
    description: string;
    amount: number;
    currency: string;
    taxInclusive: boolean;
    customerGroup: CustomerGroup;
    paymentCycle: PaymentCycle;
    service: Service;
    taxes: [];

    constructor(invoiceFeeObj: any) {
        this.id = invoiceFeeObj.id;
        this.name = invoiceFeeObj.service.name;
        this.description = invoiceFeeObj.service.description;
        this.amount = invoiceFeeObj.rate;
        this.currency = invoiceFeeObj.currency;
        this.taxInclusive = invoiceFeeObj.taxInclusive;
        this.customerGroup = invoiceFeeObj.customerGroup;
        this.paymentCycle = invoiceFeeObj.paymentCycle;
        this.service = invoiceFeeObj.service;
        this.taxes = invoiceFeeObj.invoiceFeeTaxes;
    }
}

import { Customer } from './customer.model';
import { Company } from './company.model';
import { FinancialPeriod } from './financial-period.model';
import { PaymentPolicy } from './payment-policy.model';
import { Payment } from './payment.model ';
import { Receipt } from './receipt.model';
import { User } from './user.model';
import { BatchInvoice } from './batch-invoice.model';

export class Invoice {
    id!: string;
    invoiceNumber!: string;
    invoiceDate!: string;
    invoiceDueDate!: string;
    currency!: string;
    totalAmount!: number;
    dueAmount!: number;
    paymentPolicy: PaymentPolicy;
    invoiceFees!: any[];
    payments!: Payment[];
    receipts!: Receipt[];
    customer: Customer;
    company: Company;
    financialPeriod: FinancialPeriod;
    batchInvoice!: BatchInvoice;
    createdDate!: string;
    createdBy!: User;
    deleted!: boolean;
    voided!: boolean;
    voidedBy!: User;

    /**
     *
     */
    constructor() {
        this.paymentPolicy = new PaymentPolicy();
        this.company = new Company();
        this.customer = new Customer();
        this.financialPeriod = new FinancialPeriod();
    }
}

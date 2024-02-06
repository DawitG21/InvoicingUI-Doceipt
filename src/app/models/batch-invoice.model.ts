import { FinancialPeriod } from './financial-period.model';
import { PaymentCycle } from './payment-cycle.model';
import { CustomerGroup } from './customer-group.model';
import { User } from 'oidc-client';


export class BatchInvoice {
    id!: string;
    financialPeriod!: FinancialPeriod;
    paymentCycle!: PaymentCycle;
    customerGroup!: CustomerGroup;
    invoiceDate: any;
    invoiceDueDate: any;
    createdDate: any;
    createdBy!: User;
    voided!: boolean;
    voidedBy!: User;
    invoicesCount!: number;
    hasPayment!: boolean; // payment exist which may or may not be voided
 // payment exist which may or may not be voided
    hasValidPayment!: boolean; // payment exist that has not been voided
 // payment exist that has not been voided
}

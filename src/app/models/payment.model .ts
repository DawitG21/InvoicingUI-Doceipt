import { Invoice } from './invoice.model';
import { PaymentMethod } from './payment-method.model';
import { User } from './user.model';

export class Payment {
    id!: string;
    paymentMethod: PaymentMethod;
    currency!: string;
    amount!: number;
    paymentDate!: string;
    createdDate!: string;
    createdBy!: User;
    voided!: boolean;
    invoice: Invoice;
    description!: string;

    /**
     *
     */
    constructor() {
        this.paymentMethod = new PaymentMethod();
        this.invoice = new Invoice();
    }
}

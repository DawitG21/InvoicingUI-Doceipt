import { Customer } from './customer.model';
import { Contact } from './contact.model';

export class BillingAddress {
    id!: string;
    contact!: Contact;
    customer!: Customer;
    relationship!: string;
    primaryEmail!: string;
    primaryPhone!: string;
}

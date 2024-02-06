import { BillingAddress } from './billing-address.model';
import { CustomerGroup } from './customer-group.model';
import { Company } from './company.model';
import { Branch } from './branch.model';

export class Customer {
    id!: string;
    name!: string;
    referenceId!: string;
    company: Company;
    customerGroup: CustomerGroup;
    billingAddresses: BillingAddress[];
    isActive!: boolean;
    branch!: Branch;

    /**
     *
     */
    constructor() {
        this.company = new Company();
        this.customerGroup = new CustomerGroup();
        this.billingAddresses = [];
    }
}

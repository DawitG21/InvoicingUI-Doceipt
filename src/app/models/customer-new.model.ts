import { BillingAddressNew } from './billing-address-new.model';

export class CustomerNew {
    companyId: string;
    name!: string;
    referenceId!: string;
    customerGroupId!: string;
    billingAddresses: BillingAddressNew[];
    isActive: boolean;
    branchId!: string;

    /**
     *
     */
    constructor(companyId: string) {
        this.companyId = companyId;
        this.billingAddresses = [];
        this.isActive = true;
    }
}

import { Phone } from './phone.model';
import { Machine } from './machine.model';

export class BranchNew {
    companyId: string;
    name!: string;
    email!: string;
    addressLine1!: string;
    addressLine2!: string;
    city!: string;
    state!: string;
    country!: string;
    isActive: boolean;
    phoneNumbers: Phone[];
    machines: Machine[];
    id!: string;
    company: any;
    address!: string;

    /**
     *
     */
    constructor(companyId: string) {
        this.companyId = companyId;
        this.phoneNumbers = [];
        this.machines = [];
        this.isActive = true;
    }
}

import { Phone } from './phone.model';
import { Email } from './email.model';

export class ContactNew {
    companyId: string;
    name!: string;
    gender!: string;
    emails: Email[];
    phoneNumbers: Phone[];
    addressLine1!: string;
    addressLine2!: string;
    city!: string;
    state!: string;
    country!: string;
    countryISO!: string;
    isActive: boolean;
    isOrg: boolean;

    /**
     *
     */
    constructor(companyId: string) {
        this.companyId = companyId;
        this.isActive = true;
        this.phoneNumbers = [];
        this.emails = [];
        this.isOrg = false;
    }
}

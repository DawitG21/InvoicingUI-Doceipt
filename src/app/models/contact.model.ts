import { Company } from './company.model';
import { Phone } from './phone.model';
import { Email } from './email.model';

export class Contact {
    id!: string;
    company!: Company;
    name!: string;
    gender!: string;
    emails!: Email[];
    phoneNumbers!: Phone[];
    addressLine1!: string;
    addressLine2!: string;
    city!: string;
    state!: string;
    country!: string;
    countryISO!: string;
    isActive!: boolean;
    isOrg!: boolean;
}

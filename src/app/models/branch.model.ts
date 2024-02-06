import { Company } from './company.model';
import { Phone } from './phone.model';
import { Machine } from './machine.model';

export class Branch {
    id!: string;
    email!: string;
    name!: string;
    addressLine1!: string;
    addressLine2!: string;
    city!: string;
    state!: string;
    country!: string;
    company!: Company;
    isActive!: boolean;
    phoneNumbers!: Phone[];
    machines!: Machine[];
}

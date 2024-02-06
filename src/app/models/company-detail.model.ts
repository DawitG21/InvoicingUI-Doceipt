import { Company } from './company.model';

export class CompanyDetail {
    id!: string;
    company!: Company;
    tin!: string;
    email!: string;
    dialingCode!: number;
    phone!: string;
    addressLine1!: string;
    addressLine2!: string;
    city!: string;
    state!: string;
    country!: string;
    website!: string;
}

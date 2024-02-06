import { Company } from './company.model';

export class Service {
    id!: string;
    company!: Company;
    orderNo!: number;
    isActive!: boolean;
    name!: string;
    description!: string;
    mandatory!: boolean;
}

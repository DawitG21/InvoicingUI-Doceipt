import { Company } from './company.model';

export class Tax {
    id!: string;
    name!: string;
    isActive!: boolean;
    company!: Company;
    description!: string;
    percentValue!: number;
}

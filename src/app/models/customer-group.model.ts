import { Company } from './company.model';

export class CustomerGroup {
    id!: string;
    orderNo!: number;
    isActive!: boolean;
    name!: string;
    description!: string;
    company: Company;

    /**
     *
     */
    constructor() {
        this.company = new Company();
    }
}

import { Company } from './company.model';

export class PaymentMethod {
    id!: string;
    name!: string;
    description!: string;
    company: Company;
    orderNo!: number;
    isActive!: boolean;

    /**
     *
     */
    constructor() {
        this.company = new Company();
    }
}

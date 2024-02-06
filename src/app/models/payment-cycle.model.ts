import { Company } from './company.model';

export class PaymentCycle {
    id!: string;
    orderNo!: number;
    isActive!: boolean;
    company: Company;
    name!: string;
    description!: string;

    /**
     *
     */
    constructor() {
        this.company = new Company();
    }
}

import { Company } from './company.model';

export class FinancialPeriod {
    id!: string;
    name!: string;
    description!: string;
    company: Company;
    startDate!: string;
    endDate!: string;
    opened!: boolean;
    voided!: boolean;

    /**
     *
     */
    constructor() {
        this.company = new Company();
    }
}

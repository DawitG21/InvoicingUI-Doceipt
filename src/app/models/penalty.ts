import { Company } from './company.model';
import { FinancialPeriod } from './financial-period.model';

export class Penalty {
    id!: string;
    name!: string;
    description!: string;
    rate!: number;
    rateType!: string;
    company: Company;
    financialPeriod!: FinancialPeriod;
    isPercentRate!: boolean;

    /**
     *
     */
    constructor() {
        this.company = new Company();
        this.financialPeriod = new FinancialPeriod();
    }
}

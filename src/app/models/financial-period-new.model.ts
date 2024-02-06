export class FinancialPeriodNew {
    companyId: string;
    name!: string;
    description!: string;
    startDate: any;
    endDate: any;
    opened: boolean;

    id!: string;
    company: any;
    voided!: boolean;

    constructor(companyId: string) {
        this.companyId = companyId;
        this.opened = true;
    }
}

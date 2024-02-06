export class ReportFilter {
    customer: string;
    fromDate: any;
    toDate: any;
    financialPeriodId: string;
    customerGroupIds: string[];
    paymentCycleIds: string[];
    branchIds: string[];

    /**
     *
     */
    constructor() {
        this.customer = '';
        this.fromDate = '';
        this.toDate = '';
        this.financialPeriodId = '';
        this.paymentCycleIds = [];
        this.customerGroupIds = [];
        this.branchIds = [];
    }
}

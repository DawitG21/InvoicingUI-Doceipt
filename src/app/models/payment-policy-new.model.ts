export class PaymentPolicyNew {
    companyId: string;
    name!: string;
    description!: string;
    minPercent!: number;
    autoDiscount: boolean;
    isActive: boolean;
    financialPeriods: any[];
    paymentCycles: any[];
    customerGroups: any[];
    customers: any[];

    constructor(companyid: string) {
        this.companyId = companyid;
        this.autoDiscount = true;
        this.isActive = true;
        this.financialPeriods = [];
        this.paymentCycles = [];
        this.customerGroups = [];
        this.customers = [];
    }
}

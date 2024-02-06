export class PaymentCycleNew {
    id!: string;
    companyId: string;
    name!: string;
    description!: string;
    orderNo: number;
    isActive: boolean;
    company: any;
    customerGroupId: any;
    paymentCycleId: any;

    constructor(companyId: string) {
        this.companyId = companyId;
        this.isActive = true;
        this.orderNo = 1;
    }
}

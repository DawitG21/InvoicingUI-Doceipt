export class CustomerGroupNew {
    id!: string;
    orderNo: number;
    isActive: boolean;
    companyId: string;
    name!: string;
    description!: string;
    company: any;
    customerGroupId: any;
    paymentCycleId: any;
    constructor(companyId: string) {
        this.companyId = companyId;
        this.isActive = true;
        this.orderNo = 1;
    }
}

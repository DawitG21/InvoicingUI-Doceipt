export class PaymentMethodNew {
    id!: string;
    companyId: string;
    name!: string;
    description!: string;
    company: any;
    orderNo: number;
    isActive: boolean;
    constructor(companyId: string) {
        this.companyId = companyId;
        this.isActive = true;
        this.orderNo = 1;
    }
}

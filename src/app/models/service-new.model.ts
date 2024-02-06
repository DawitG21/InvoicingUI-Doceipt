export class ServiceNew {
    companyId: string;
    name!: string;
    orderNo: number;
    isActive: boolean;
    mandatory: boolean;
    description!: string;
    id!: string;
    company: any;

    constructor(companyId: string) {
        this.companyId = companyId;
        this.orderNo = 1;
        this.isActive = true;
        this.mandatory = false;
    }
}

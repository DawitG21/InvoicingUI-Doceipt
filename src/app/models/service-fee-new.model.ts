export class ServiceFeeNew {
    name!: string;
    description!: string;
    customerGroupId!: string;
    paymentCycleId!: string;
    serviceId!: string;
    currency!: string;
    amount!: number;
    taxInclusive: boolean;
    taxes: any[];

    constructor() {
        this.taxes = [];
        this.taxInclusive = false;
    }
}

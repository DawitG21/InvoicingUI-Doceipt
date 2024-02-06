import { PaymentMethod } from './payment-method.model';
import { Flag } from './flag.model';

export class ConnectorNew {
    companyId: string;
    name!: string;
    description!: string;
    domains!: string;
    paymentMethod!: PaymentMethod;
    provider!: Flag;
    flags: Flag[];

    constructor(companyId: string) {
        this.companyId = companyId;
        this.flags = [];
    }
}

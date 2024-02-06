import { PaymentMethod } from './payment-method.model';
import { Flag } from './flag.model';

export class Connector {
    id!: string;
    name!: string;
    apiKeyHashless!: string;
    domains!: string;
    paymentMethod!: PaymentMethod;
    description!: string;
    flags!: Flag[];
    provider!: Flag;
}

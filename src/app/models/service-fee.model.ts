import { Service } from './service.model';
import { PaymentCycle } from './payment-cycle.model';
import { CustomerGroup } from './customer-group.model';
import { Tax } from './tax.model';

export class ServiceFee {
    id!: string;
    name!: string;
    amount!: number;
    currency!: string;
    taxInclusive!: boolean;
    customerGroup!: CustomerGroup;
    paymentCycle!: PaymentCycle;
    service!: Service;
    taxes!: Tax[];
    description!: string;

}

import { Customer } from './customer.model';
import { FinancialPeriod } from './financial-period.model';
import { PaymentCycle } from './payment-cycle.model';
import { CustomerGroup } from './customer-group.model';

export class PaymentPolicy {
    id!: string;
    name!: string;
    description!: string;
    minPercent!: number;
    autoDiscount!: boolean;
    isActive!: boolean;
    financialPeriods!: FinancialPeriod[];
    paymentCycles!: PaymentCycle[];
    customerGroups!: CustomerGroup[];
    customers!: Customer[];

    /**
     *
     */
    constructor() {
    }
}

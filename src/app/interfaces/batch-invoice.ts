import { FinancialPeriod } from './financial-period';
import { PaymentCycle } from './payment-cycle';
import { CustomerGroup } from './customer-group';
import { User } from './user';

export interface BatchInvoice {
  id: string;
  financialPeriod: FinancialPeriod;
  paymentCycle: PaymentCycle;
  customerGroup: CustomerGroup;
  invoiceDate: any;
  invoiceDueDate: any;
  createdDate: any;
  createdBy: User;
  voided: boolean;
  voidedBy: User;
  invoicesCount: number;
  hasPayment: boolean;
  hasValidPayment: boolean;
}

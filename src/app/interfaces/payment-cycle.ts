import { Company } from './company';

export interface PaymentCycle {
  id: string;
  name: string;
  description: string;
  orderNo: number;
  isActive: boolean;
  company: Company;
}

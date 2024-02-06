import { Company } from './company';

export interface CustomerGroup {
  id: string;
  name: string;
  description: string;
  orderNo: number;
  isActive: boolean;
  company: Company;
}

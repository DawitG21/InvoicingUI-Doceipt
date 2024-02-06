import { Company } from './company.model';

export class Machine {
    id!: string;
    company!: Company;
    machineNo!: string;
    name!: string;
    brand!: string;
    model!: string;
    serial!: string;
    isActive!: boolean;
}

import { Company } from './company.model';
import { RoleReport } from './role-report.model';

export class Role {
    id!: string;
    name!: string;
    description!: string;
    company!: Company;
    reports!: RoleReport[];
}

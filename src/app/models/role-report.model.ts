import { ReportFlag } from './report-flag.model';

export class RoleReport {
    id!: string;
    name!: string;
    code!: string;
    description!: string;
    category!: string;
    isActive!: boolean;
    reportFlags!: ReportFlag[];
}
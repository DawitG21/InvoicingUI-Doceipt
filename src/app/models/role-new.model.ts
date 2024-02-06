import { Claim } from './claim.model';
import { RoleReport } from './role-report.model';

export class RoleNew {
    companyId: string;
    name!: string;
    description!: string;
    reports!: RoleReport[];
    claims!: Claim[];

    /**
     *
     */
    constructor(companyId: string) {
        this.companyId = companyId;
    }
}

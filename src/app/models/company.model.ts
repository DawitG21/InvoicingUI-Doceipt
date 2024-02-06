import { CompanyDetail } from './company-detail.model';

export class Company {
    id!: string;
    displayName!: string;
    identityName!: string;
    currency!: string;
    companyDetail!: CompanyDetail;
}

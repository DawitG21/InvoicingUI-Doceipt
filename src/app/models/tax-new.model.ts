export class TaxNew {
    id!: string;
    companyId: string;
    name!: string;
    isActive: boolean;
    description!: string;
    percentValue!: number;
    company: any;

    constructor(companyId: string) {
        this.companyId = companyId;
        this.isActive = true;
    }
}

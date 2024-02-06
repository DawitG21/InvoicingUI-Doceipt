export class CompanyDetailNew {
    companyId: string;
    tin!: string;
    email!: string;
    dialingCode!: string;
    phone!: string;
    addressLine1!: string;
    addressLine2!: string;
    city!: string;
    state!: string;
    country!: string;
    website!: string;

    /**
     *
     */
    constructor(companyId: string) {
        this.companyId = companyId;
    }
}

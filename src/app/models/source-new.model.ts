export class SourceNew {
    companyId: string;
    name!: string;
    authType!: string;
    authUrl!: string;
    authToken!: string;
    authUsername!: string;
    authPassword!: string;
    customerUrl!: string;
    contactUrl!: string;
    branchUrl!: string;
    customerGroupUrl!: string;
    isActive: boolean;

    constructor(companyId: string) {
        this.companyId = companyId;
        this.isActive = true;
    }
}

export class MachineNew {
    companyId: string;
    machineNo!: string;
    name!: string;
    brand!: string;
    model!: string;
    serial!: string;
    isActive: boolean;

    /**
     *
     */
    constructor(companyId: string) {
        this.companyId = companyId;
        this.isActive = true;
    }
}

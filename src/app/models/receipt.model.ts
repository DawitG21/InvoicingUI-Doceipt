import { User } from './user.model';

export class Receipt {
    id!: string;
    receiptNumber!: string;
    createdDate!: string;
    createdBy!: User;
    voided!: boolean;
    fsNumber!: string;
    machineName!: string;
    machineNo!: string;
    remark!: String;
}

import { Machine } from './machine.model';

export class ReceiptUpdate {
    id!: string;
    fsNumber!: string;
    machine!: Machine;
    remark!: string;
}

import { Flag } from './flag.model';

export class Claim {
    public id!: string;
    public name!: string;
    public category!: string;
    public flag!: Flag;
}

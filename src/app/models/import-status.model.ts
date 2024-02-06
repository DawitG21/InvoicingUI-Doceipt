import { User } from './user.model';

export class ImportStatus {
    public id!: string;
    public page!: number;
    public pageSize!: number;
    public rows!: number;
    public isCompleted!: boolean;
    public isSuccess!: boolean;
    public createdDate!: string;
    public createdBy!: User;
}
import { Company } from './company.model';
import { User } from './user.model';

export class UserInvite {
    id!: string;
    username!: string;
    isOwner!: boolean;
    company!: Company;
    invitedBy!: User;
}

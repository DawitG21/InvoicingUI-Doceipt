import { Role } from './role.model';
import { Branch } from './branch.model';

export class UserInviteNew {
    public companyId: string;
    public username: string;
    public roles: Role[];
    public isOwner: boolean;
    public branches: Branch[];

    /**
     *
     */
    constructor(companyId: string) {
        this.companyId = companyId;
        this.username = '';
        this.isOwner = false;
        this.roles = [];
        this.branches = [];
    }
}

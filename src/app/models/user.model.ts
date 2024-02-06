import { Branch } from './branch.model';

export class User {
    id!: string;
    name!: string;
    givenName!: string;
    familyName!: string;
    email!: string;
    isOwner!: boolean;
    isPrincipalOwner!: boolean;
    branches!: Branch[];
}

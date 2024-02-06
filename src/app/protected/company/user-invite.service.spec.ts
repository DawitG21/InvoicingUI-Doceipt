import { TestBed } from '@angular/core/testing';

import { UserInviteService } from './user-invite.service';

describe('UserInviteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserInviteService = TestBed.get(UserInviteService);
    expect(service).toBeTruthy();
  });
});

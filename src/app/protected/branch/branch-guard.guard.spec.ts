import { TestBed } from '@angular/core/testing';

import { BranchGuardGuard } from './branch-guard.guard';

describe('BranchGuardGuard', () => {
  let guard: BranchGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BranchGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CompanyDetailGuardGuard } from './company-detail-guard.guard';

describe('CompanyDetailGuardGuard', () => {
  let guard: CompanyDetailGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CompanyDetailGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { FinancialPeriodGuard } from './financial-period.guard';

describe('FinancialPeriodGuard', () => {
  let guard: FinancialPeriodGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FinancialPeriodGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

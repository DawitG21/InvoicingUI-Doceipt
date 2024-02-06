import { TestBed } from '@angular/core/testing';

import { FinancialPeriodService } from './financial-period.service';

describe('FinancialPeriodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FinancialPeriodService = TestBed.get(FinancialPeriodService);
    expect(service).toBeTruthy();
  });
});

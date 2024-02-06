import { TestBed } from '@angular/core/testing';

import { TaxGuard } from './tax.guard';

describe('TaxGuard', () => {
  let guard: TaxGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TaxGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

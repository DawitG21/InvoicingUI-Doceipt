import { TestBed } from '@angular/core/testing';

import { PaymentCycleGuard } from './payment-cycle.guard';

describe('PaymentCycleGuard', () => {
  let guard: PaymentCycleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PaymentCycleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

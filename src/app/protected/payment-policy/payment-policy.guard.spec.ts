import { TestBed } from '@angular/core/testing';

import { PaymentPolicyGuard } from './payment-policy.guard';

describe('PaymentPolicyGuard', () => {
  let guard: PaymentPolicyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PaymentPolicyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

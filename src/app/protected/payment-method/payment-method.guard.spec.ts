import { TestBed } from '@angular/core/testing';

import { PaymentMethodGuard } from './payment-method.guard';

describe('PaymentMethodGuard', () => {
  let guard: PaymentMethodGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PaymentMethodGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

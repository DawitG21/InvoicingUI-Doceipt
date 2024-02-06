import { TestBed } from '@angular/core/testing';

import { PaymentPolicyService } from './payment-policy.service';

describe('PaymentPolicyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentPolicyService = TestBed.get(PaymentPolicyService);
    expect(service).toBeTruthy();
  });
});

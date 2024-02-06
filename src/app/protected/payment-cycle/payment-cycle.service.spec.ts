import { TestBed } from '@angular/core/testing';

import { PaymentCycleService } from './payment-cycle.service';

describe('PaymentCycleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentCycleService = TestBed.get(PaymentCycleService);
    expect(service).toBeTruthy();
  });
});

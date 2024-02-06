import { TestBed } from '@angular/core/testing';

import { ServiceFeeGuard } from './service-fee.guard';

describe('ServiceFeeGuard', () => {
  let guard: ServiceFeeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ServiceFeeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

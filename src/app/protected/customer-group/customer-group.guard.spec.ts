import { TestBed } from '@angular/core/testing';

import { CustomerGroupGuard } from './customer-group.guard';

describe('CustomerGroupGuard', () => {
  let guard: CustomerGroupGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomerGroupGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

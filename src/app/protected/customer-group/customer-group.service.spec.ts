import { TestBed } from '@angular/core/testing';

import { CustomerGroupService } from './customer-group.service';

describe('CustomerGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerGroupService = TestBed.get(CustomerGroupService);
    expect(service).toBeTruthy();
  });
});

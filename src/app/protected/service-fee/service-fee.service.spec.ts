import { TestBed } from '@angular/core/testing';

import { ServiceFeeService } from './service-fee.service';

describe('ServiceFeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceFeeService = TestBed.get(ServiceFeeService);
    expect(service).toBeTruthy();
  });
});

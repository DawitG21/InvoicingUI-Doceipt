import { TestBed } from '@angular/core/testing';

import { TaxService } from './tax.service';

describe('TaxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaxService = TestBed.get(TaxService);
    expect(service).toBeTruthy();
  });
});

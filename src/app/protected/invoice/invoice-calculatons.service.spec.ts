import { TestBed } from '@angular/core/testing';

import { InvoiceCalculatonsService } from './invoice-calculatons.service';

describe('InvoiceCalculatonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvoiceCalculatonsService = TestBed.get(InvoiceCalculatonsService);
    expect(service).toBeTruthy();
  });
});

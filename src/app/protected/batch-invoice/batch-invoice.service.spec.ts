import { TestBed } from '@angular/core/testing';

import { BatchInvoiceService } from './batch-invoice.service';

describe('BatchInvoiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BatchInvoiceService = TestBed.get(BatchInvoiceService);
    expect(service).toBeTruthy();
  });
});

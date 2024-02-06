import { TestBed } from '@angular/core/testing';

import { CompanyDetailService } from './company-detail.service';

describe('CompanyDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyDetailService = TestBed.get(CompanyDetailService);
    expect(service).toBeTruthy();
  });
});

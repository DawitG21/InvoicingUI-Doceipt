import { TestBed } from '@angular/core/testing';

import { ReportEndpointService } from './report-endpoint.service';

describe('ReportEndpointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportEndpointService = TestBed.get(ReportEndpointService);
    expect(service).toBeTruthy();
  });
});

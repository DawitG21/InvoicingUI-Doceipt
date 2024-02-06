import { TestBed } from '@angular/core/testing';

import { ProtectedService } from './protected.service';

describe('ProtectedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProtectedService = TestBed.get(ProtectedService);
    expect(service).toBeTruthy();
  });
});

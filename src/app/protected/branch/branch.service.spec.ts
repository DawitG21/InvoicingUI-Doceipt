import { TestBed } from '@angular/core/testing';

import { BranchService } from './branch.service';

describe('BranchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BranchService = TestBed.get(BranchService);
    expect(service).toBeTruthy();
  });
});

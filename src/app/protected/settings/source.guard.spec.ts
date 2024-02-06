import { TestBed } from '@angular/core/testing';

import { SourceGuard } from './source.guard';

describe('SourceGuard', () => {
  let guard: SourceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SourceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ConnectorGuard } from './connector.guard';

describe('ConnectorGuard', () => {
  let guard: ConnectorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConnectorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

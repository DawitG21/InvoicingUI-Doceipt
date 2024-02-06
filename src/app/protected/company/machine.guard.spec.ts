import { TestBed } from '@angular/core/testing';

import { MachineGuard } from './machine.guard';

describe('MachineGuard', () => {
  let guard: MachineGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MachineGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

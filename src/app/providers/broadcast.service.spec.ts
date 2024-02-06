import { TestBed } from '@angular/core/testing';

import { BroadcastService } from './broadcast.service';

describe('BroadcastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BroadcastService = TestBed.get(BroadcastService);
    expect(service).toBeTruthy();
  });
});

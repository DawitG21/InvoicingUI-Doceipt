import { TestBed } from '@angular/core/testing';

import { ResourceEndpointService } from './resource-endpoint.service';

describe('ResourceEndpointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceEndpointService = TestBed.get(ResourceEndpointService);
    expect(service).toBeTruthy();
  });
});

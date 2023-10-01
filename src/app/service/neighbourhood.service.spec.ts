import { TestBed } from '@angular/core/testing';

import { NeighbourhoodService } from './neighbourhood.service';

describe('NeighbourhoodService', () => {
  let service: NeighbourhoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeighbourhoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { EtudeService } from './etude.service';

describe('EtudeService', () => {
  let service: EtudeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtudeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

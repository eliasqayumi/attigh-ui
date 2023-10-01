import { TestBed } from '@angular/core/testing';

import { ImplementationTypeService } from './implementation-type.service';

describe('ImplementationTypeService', () => {
  let service: ImplementationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImplementationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

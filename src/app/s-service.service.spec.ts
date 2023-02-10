import { TestBed } from '@angular/core/testing';

import { SServiceService } from './s-service.service';

describe('SServiceService', () => {
  let service: SServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

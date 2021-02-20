import { TestBed } from '@angular/core/testing';

import { EuroExService } from './euro-ex.service';

describe('EuroExService', () => {
  let service: EuroExService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EuroExService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

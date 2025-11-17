import { TestBed } from '@angular/core/testing';

import { StoricoService } from './storico-service';

describe('StoricoService', () => {
  let service: StoricoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoricoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

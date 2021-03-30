import { TestBed } from '@angular/core/testing';

import { FotoserviceService } from './fotoservice.service';

describe('FotoserviceService', () => {
  let service: FotoserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FotoserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

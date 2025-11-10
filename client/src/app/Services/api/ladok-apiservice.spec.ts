import { TestBed } from '@angular/core/testing';

import { LadokAPIService } from './ladok-apiservice';

describe('LadokAPIService', () => {
  let service: LadokAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LadokAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

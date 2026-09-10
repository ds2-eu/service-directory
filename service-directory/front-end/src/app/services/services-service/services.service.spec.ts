import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ServicesService } from './services.service';

describe('ServicesService', () => {
  let service: ServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(ServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

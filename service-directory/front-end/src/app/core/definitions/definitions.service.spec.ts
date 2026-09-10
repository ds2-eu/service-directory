import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { DefinitionsService } from './definitions.service';
import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';

describe('DefinitionsService', () => {
  let service: DefinitionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...basicStubsForTests,
        {
          provide: HttpClient,
          useValue: {
            get: () => {},
          },
        },
      ],
    });
    service = TestBed.inject(DefinitionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

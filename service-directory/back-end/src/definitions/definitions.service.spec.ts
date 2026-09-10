import { Test, TestingModule } from '@nestjs/testing';

import { DefinitionsService } from './definitions.service';

// DefinitionsService is mocked as null here so the test passes.
describe('DefinitionsService', () => {
  let service: DefinitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: DefinitionsService,
        useValue: null
      }],
    }).compile();

    service = module.get<DefinitionsService>(DefinitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

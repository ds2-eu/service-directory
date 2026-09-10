import { TestBed } from '@angular/core/testing';

import basicStubsForTests, {
  stubForToastr,
} from '@app/core/testing/basic-stubs-for-tests';
import { MsgboxService } from './msgbox.service';

describe('MsgboxService', () => {
  let service: MsgboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...basicStubsForTests],
    });
    service = TestBed.inject(MsgboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call Toastr', () => {
    const spy = spyOn(stubForToastr, 'success');
    service.showSuccess('This is a test');
    expect(spy).toHaveBeenCalledWith('This is a test');
  });
});

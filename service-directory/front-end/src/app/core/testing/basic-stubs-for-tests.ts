import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TOAST_CONFIG, ToastrService } from 'ngx-toastr';
import { Subject, of } from 'rxjs';

import { ConfigService } from '@app/core/config';

const stubForToastr = { success: (x) => x };

const basicStubsForTests = [
  {
    provide: ActivatedRoute,
    useValue: {
      paramMap: of({}),
      snapshot: { paramMap: { get: () => 123 } },
    },
  },
  {
    provide: ConfigService,
    useValue: {
      config: {
        backend:
          'https://service-directory-api.orchestration-test.icelab.cloud',
      },
    },
  },
  {
    provide: Router,
    useValue: {
      events: new Subject(),
      navigateByUrl: () => of({}),
    },
  },
  {
    provide: BsModalService,
    useValue: {},
  },
  {
    provide: ToastrService,
    useValue: stubForToastr,
  },
  {
    provide: TOAST_CONFIG,
    useValue: {},
  },
];

export default basicStubsForTests;
export { stubForToastr };

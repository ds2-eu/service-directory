import { HttpClient, HttpHandler } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { delay, of } from 'rxjs';

import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { Service } from '@app/services/services-service/service.interface';
import { ServicesService } from '@app/services/services-service/services.service';
import { GatewayService } from '@app/gateway/gateway-service';
import { ServiceDetailsComponent } from './service-details.component';

const fakeService: Service = {
  _id: '123',
  name: 'Test service',
  openApiYamlEndpoint: 'http://url-for-yaml',
  openApiUiEndpoint: 'http://url-for-swagger',
  openApiDefinition: '',
  description: '',
  hideFromOrchestration: false,
  __v: 0,
};

describe('ServiceDetailsComponent', () => {
  let component: ServiceDetailsComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<ServiceDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceDetailsComponent],
      providers: [
        HttpClient,
        HttpHandler,
        GatewayService,
        ServicesService, // GatewayService & ServicesService are mocked in individual tests
        ...basicStubsForTests,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDetailsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    expect(element.querySelector('h2')?.textContent).toEqual(
      'Selected service'
    );
  });

  it('should not have any controls until a service has loaded', () => {
    fixture.detectChanges();
    expect(element.querySelector('a, button')).toBe(null);
  });

  it('should say it’s loading, then show the service with authentication loading, then show the service with authentication', fakeAsync(() => {
    // Mocking service-calls for the service (taking two seconds) and its security definition (taking one second).
    const servicesService = fixture.debugElement.injector.get(ServicesService);
    spyOn(servicesService, 'getService').and.callFake(() =>
      of(fakeService).pipe(delay(2000))
    );
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'getSecurityDefinitionWithSimilarUrl').and.callFake(
      () => of(null).pipe(delay(1000))
    );

    // After one second, the service should still be loading.
    fixture.detectChanges();
    tick(1000);

    expect(component.loading).toEqual(true);
    expect(element.textContent).toEqual('Selected serviceLoading service…');
    expect(element.querySelector('p').textContent).toEqual('Loading service…');

    // After another second, the service should have loaded, triggering the security definition to start loading.
    tick(1000);
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.service).toEqual(fakeService);
    expect(element.textContent).toContain(
      'Selected service Edit  Authentication  Delete Close detailsName Test service Description(no description given)URL for the OpenAPI Yaml http://url-for-yaml URL for the Swagger UI http://url-for-swagger Authentication(loading…)'
    );
    expect(element.querySelector('dd:last-of-type').textContent).toEqual(
      '(loading…)'
    );

    // After another second, the security definition (mocked as null) should have loaded.
    tick(1000);
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.service).toEqual(fakeService);
    expect(element.querySelector('dd:last-of-type').textContent).toEqual(
      '(no authentication given)'
    );
  }));

  it('should have controls', fakeAsync(() => {
    const servicesService = fixture.debugElement.injector.get(ServicesService);
    spyOn(servicesService, 'getService').and.callFake(() => of(fakeService));
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'getSecurityDefinitionWithSimilarUrl').and.callFake(
      () => of(null)
    );
    fixture.detectChanges();

    const controls = element.querySelectorAll('a, button');
    expect(controls.length).toBe(6);
    // Four controls at the top of the “Selected service” pane, then two links in the <dl>
    expect(controls[0].textContent.trim()).toBe('Edit');
    expect(controls[1].textContent.trim()).toBe('Authentication');
    expect(controls[2].textContent.trim()).toBe('Delete');
    expect(controls[3].textContent.trim()).toBe('Close details');
    expect(controls[4].textContent.trim()).toBe('http://url-for-yaml');
    expect(controls[5].textContent.trim()).toBe('http://url-for-swagger');

    // Text content of links should be the URLs they point to.
    expect(controls[4].textContent.trim()).toEqual(
      controls[4].attributes['href'].value
    );
    expect(controls[5].textContent.trim()).toEqual(
      controls[5].attributes['href'].value
    );
  }));
});

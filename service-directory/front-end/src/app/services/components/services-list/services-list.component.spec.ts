import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { delay, of } from 'rxjs';

import { ServicesService } from '@app/services/services-service/services.service';
import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { Service } from '@app/services/services-service/service.interface';
import { ServicesListComponent } from './services-list.component';

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

describe('ServicesListComponent', () => {
  let component: ServicesListComponent;
  let fixture: ComponentFixture<ServicesListComponent>;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesListComponent],
      providers: [
        HttpClient,
        HttpHandler,
        ...basicStubsForTests,
        ServicesService, // ServicesService is mocked in individual tests.
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain “List of services”', () => {
    expect(element.textContent).toContain('List of services');
  });

  it('should contain a <h2> saying “List of services”', () => {
    const heading = element.querySelector('h2');
    expect(heading.textContent).toEqual('List of services');
  });

  it('should say “Loading” while services are loading', () => {
    const servicesService = fixture.debugElement.injector.get(ServicesService);
    spyOn(servicesService, 'getServices').and.callFake(() =>
      of([fakeService]).pipe(delay(2000))
    );

    fixture.detectChanges();
    expect(element.textContent).toContain('Loading');
  });

  it('should not show any services or “Add service” buttons while services are loading', () => {
    const links = element.querySelectorAll('a');
    expect(links.length).toBe(0);
  });

  it('should render correctly when loading finishes with no services', fakeAsync(() => {
    // Mocking service-call for the services (taking one second).
    const servicesService = fixture.debugElement.injector.get(ServicesService);
    spyOn(servicesService, 'getServices').and.callFake(() =>
      of([]).pipe(delay(1000))
    );

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(component.loading).toEqual(false);
    expect(element.textContent).toContain(
      'List of services There are no services.  Add a service'
    );
    expect(element.querySelector('p').textContent).toContain(
      'There are no services'
    );
    expect(element.querySelector('ul')).toBeFalsy();
    const links = element.querySelectorAll('a');
    expect(links.length).toBe(1);
    expect(links[0].textContent.trim()).toEqual('Add a service');
  }));

  it('should say it’s loading, then show the services', fakeAsync(() => {
    // Mocking service-call for the services (taking two seconds).
    const servicesService = fixture.debugElement.injector.get(ServicesService);
    spyOn(servicesService, 'getServices').and.callFake(() =>
      of([fakeService]).pipe(delay(2000))
    );

    // After one second, the services should still be loading.
    fixture.detectChanges();
    tick(1000);

    expect(component.loading).toEqual(true);
    expect(element.textContent).toEqual('List of servicesLoading services…');
    expect(element.querySelector('p').textContent).toEqual('Loading services…');

    // After another second, the services should have loaded.
    tick(1000);
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.services).toEqual([fakeService]);

    expect(element.querySelector('h2').textContent.trim()).toEqual(
      'List of services'
    );
    expect(element.querySelector('p').textContent.trim()).toEqual(
      'Below are all the services in the directory.'
    );
    expect(element.querySelector('ul li').textContent.trim()).toEqual(
      'Test service'
    );
    expect(element.querySelector('a:not(ul a)').textContent.trim()).toEqual(
      'Add a service'
    );
  }));
});

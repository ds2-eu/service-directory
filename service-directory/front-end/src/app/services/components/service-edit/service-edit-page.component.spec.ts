import { HttpClient, HttpHandler } from '@angular/common/http';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { delay, of } from 'rxjs';

import { ServiceEditPageComponent } from './service-edit-page.component';
import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { ServicesService } from '@app/services/services-service/services.service';
import { SpinButtonComponent } from '@app/shared/spin-button/spin-button.component';
import { Service } from '@app/services/services-service/service.interface';

const fakeServiceWithEndpoint: Service = {
  _id: '123',
  name: 'Test service',
  openApiYamlEndpoint: 'http://',
  openApiUiEndpoint: 'http://',
  openApiDefinition: '',
  description: '',
  hideFromOrchestration: false,
  __v: 0,
};

const fakeServiceWithoutEndpoint: Service = {
  _id: '123',
  name: 'Test service',
  openApiYamlEndpoint: '',
  openApiUiEndpoint: '',
  openApiDefinition: 'yaml specification here',
  description: '',
  hideFromOrchestration: false,
  __v: 0,
};

describe('ServiceEditPageComponent', () => {
  let component: ServiceEditPageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<ServiceEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceEditPageComponent],
      providers: [
        FormBuilder,
        HttpClient,
        HttpHandler,
        SpinButtonComponent,
        ServicesService, // ServicesService is mocked in individual tests.
        ...basicStubsForTests,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceEditPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have any buttons if the service hasn’t loaded', () => {
    expect(element.querySelector('button')).toBe(null);
  });

  it('should render Loading, then render form', fakeAsync(() => {
    const servicesService = fixture.debugElement.injector.get(ServicesService);
    spyOn(servicesService, 'getService').and.callFake(() => {
      return of(fakeServiceWithEndpoint).pipe(delay(2000));
    });

    fixture.detectChanges();
    tick(1000);
    expect(component.loading).toEqual(true);
    expect(element.textContent).toEqual('Loading…');

    tick(1000);
    fixture.detectChanges();
    expect(component.loading).toEqual(false);
    expect(component.service).toEqual(fakeServiceWithEndpoint);
    expect(element.textContent).toContain(
      'Fields marked with an asterisk are required. Name * Description  Hide from Orchestration  Has OpenAPI endpoint  OpenAPI Yaml URL * Swagger UI URL'
    );
  }));

  it('should render a form with six inputs', fakeAsync(() => {
    const servicesService = fixture.debugElement.injector.get(ServicesService);
    spyOn(servicesService, 'getService').and.callFake(() =>
      of(fakeServiceWithEndpoint)
    );

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.service).toEqual(fakeServiceWithEndpoint);
    const inputs = element.querySelectorAll('form input');
    expect(inputs.length).toBe(6);
    // The inputs should be:
    // - Name
    // - Description
    // - Hide from Orchestration
    // - Has OpenAPI endpoint (ticked)
    // - OpenAPI Yaml URL
    // - Swagger UI URL
  }));

  it('should render different inputs if the service does not have an endpoint for the OpenAPI spec', fakeAsync(async () => {
    const servicesService = fixture.debugElement.injector.get(ServicesService);
    spyOn(servicesService, 'getService').and.callFake(() =>
      of(fakeServiceWithoutEndpoint)
    );

    fixture.detectChanges();
    expect(component.service).toEqual(fakeServiceWithoutEndpoint);

    const checkbox = element.querySelector(
      'input[type="checkbox"]#chkHasOpenApiEndpoint'
    );
    expect(checkbox['checked']).toBeFalse();

    const controls = element.querySelectorAll('form input, form textarea');

    const expectedControlNames = [
      'name',
      'description',
      'hideFromOrchestration',
      'hasOpenApiEndpoint',
      'openApiDefinition',
    ];

    controls.forEach((control, index) =>
      expect(control.getAttribute('formcontrolname'))
        .withContext(`control ${index} should match the expected name`)
        .toBe(expectedControlNames[index])
    );
    // This second `foreach` is helpful in case fewer controls are in the DOM than are expected.
    expectedControlNames.forEach((expectedName, index) =>
      expect(controls[index]?.getAttribute('formcontrolname'))
        .withContext(`expected name ${index} should match the control`)
        .toBe(expectedName)
    );
    expect(controls.length)
      .withContext(`number of controls`)
      .toBe(expectedControlNames.length);
  }));
});

import { HttpClient, HttpHandler } from '@angular/common/http';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { delay, of } from 'rxjs';

import { SecurityEditPageComponent } from './security-edit-page.component';
import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { GatewayService, OAuth2Data } from '@app/gateway/gateway-service';
import { SpinButtonComponent } from '@app/shared/spin-button/spin-button.component';
import { SecurityDefinition } from '@app/gateway/gateway-service';

const fakeSecurityDefinition: SecurityDefinition = {
  id: '123',
  name: 'Example definition',
  url: 'http://',
  authType: '',
  authInfo: new OAuth2Data(),
};

describe('SecurityEditPageComponent', () => {
  let component: SecurityEditPageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<SecurityEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityEditPageComponent],
      providers: [
        FormBuilder,
        HttpClient,
        HttpHandler,
        SpinButtonComponent,
        GatewayService, // GatewayService is mocked in individual tests.
        ...basicStubsForTests,
        {
          provider: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: of(convertToParamMap({ id: 123 })) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityEditPageComponent);
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
    // Mocking the component’s own method is easier than mocking ActivatedRoute, which the method relies on.
    spyOn(component, 'loadSecurityDefinition').and.callFake(() => {
      component.loadById('123');
    });
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'getSecurityDefinitionById').and.callFake(() => {
      return of(fakeSecurityDefinition).pipe(delay(2000));
    });

    fixture.detectChanges();
    tick(1000);
    expect(component.isLoading).toEqual(true);
    expect(element.textContent).toEqual('Loading…');

    tick(1000);
    fixture.detectChanges();
    expect(component.isLoading).toEqual(false);
    expect(element.textContent).toContain(
      'Fields marked with an asterisk are required.“Name” is a name for this security definition; it can be the same as the service. Name * Service URL * Authorisation type *BasicOAuth2Fixed headers'
    );
  }));

  it('should render a form with three inputs if authentication is not set', fakeAsync(() => {
    // Mocking the component’s own method is easier than mocking ActivatedRoute, which the method relies on.
    spyOn(component, 'loadSecurityDefinition').and.callFake(() => {
      component.loadById('123');
    });
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'getSecurityDefinitionById').and.callFake(() =>
      of(fakeSecurityDefinition)
    );

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    const controls = element.querySelectorAll('form input, form select');
    expect(controls.length).toBe(3);
    expect(controls[0].tagName).toBe('INPUT');
    expect(controls[1].tagName).toBe('INPUT');
    expect(controls[2].tagName).toBe('SELECT');
    // The three controls should be:
    // - Name <input>
    // - Service URL <input>
    // - Authorisation type <select>
    // More controls should appear if the authorisation type is set.
    // For example, if the authorisation type is Basic, we should get:
    // - User name <input>
    // - Password <input>
  }));

  it('should render a form with five inputs if authentication is basic', fakeAsync(() => {
    // Mocking the component’s own method is easier than mocking ActivatedRoute, which the method relies on.
    spyOn(component, 'loadSecurityDefinition').and.callFake(() => {
      component.loadById('123');
    });
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'getSecurityDefinitionById').and.callFake(() =>
      of({ ...fakeSecurityDefinition, authType: 'Basic' })
    );

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    const controls = element.querySelectorAll('form input, form select');
    expect(controls.length).toBe(5);
    expect(controls[0].tagName).toBe('INPUT');
    expect(controls[1].tagName).toBe('INPUT');
    expect(controls[2].tagName).toBe('SELECT');
    expect(controls[3].tagName).toBe('INPUT');
    expect(controls[4].tagName).toBe('INPUT');
    // The five controls should be:
    // - Name <input>
    // - Service URL <input>
    // - Authorisation type <select>
    // - User name <input>
    // - Password <input>
  }));

  it('should render a form with five inputs if authentication is OAuth2', fakeAsync(() => {
    // Mocking the component’s own method is easier than mocking ActivatedRoute, which the method relies on.
    spyOn(component, 'loadSecurityDefinition').and.callFake(() => {
      component.loadById('123');
    });
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'getSecurityDefinitionById').and.callFake(() =>
      of({ ...fakeSecurityDefinition, authType: 'OAuth2' })
    );

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    const controls = element.querySelectorAll('form input, form select');
    expect(controls.length).toBe(12);
    expect(controls[0].tagName).toBe('INPUT');
    expect(controls[1].tagName).toBe('INPUT');
    expect(controls[2].tagName).toBe('SELECT');
    expect(controls[3].tagName).toBe('INPUT');
    expect(controls[4].tagName).toBe('INPUT');
    expect(controls[5].tagName).toBe('INPUT');
    expect(controls[6].tagName).toBe('INPUT');
    expect(controls[7].tagName).toBe('INPUT');
    expect(controls[8].tagName).toBe('INPUT');
    expect(controls[9].tagName).toBe('INPUT');
    expect(controls[10].tagName).toBe('INPUT');
    expect(controls[11].tagName).toBe('INPUT');
    // The twelve controls should be:
    // - Name <input>
    // - Service URL <input>
    // - Authorisation type <select>
    // - etc
  }));

  it('should render a form with three inputs if authentication is fixed headers', fakeAsync(() => {
    // Mocking the component’s own method is easier than mocking ActivatedRoute, which the method relies on.
    spyOn(component, 'loadSecurityDefinition').and.callFake(() => {
      component.loadById('123');
    });
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'getSecurityDefinitionById').and.callFake(() =>
      of({ ...fakeSecurityDefinition, authType: 'FixedHeaders' })
    );

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    const controls = element.querySelectorAll('form input, form select');
    expect(controls.length).toBe(3);
    expect(controls[0].tagName).toBe('INPUT');
    expect(controls[1].tagName).toBe('INPUT');
    expect(controls[2].tagName).toBe('SELECT');
    // The three controls should be:
    // - Name <input>
    // - Service URL <input>
    // - Authorisation type <select>
    // The fixed headers get added in the <header-list> component,
    // which has no inputs until the button to add a header is clicked.
  }));
});

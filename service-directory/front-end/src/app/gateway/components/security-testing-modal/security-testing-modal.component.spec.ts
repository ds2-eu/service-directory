import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { delay, of } from 'rxjs';

import { GatewayService } from '@app/gateway/gateway-service/gateway.service';
import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import {
  ITestServiceRequest,
  OAuth2Data,
} from '@app/gateway/gateway-service/defs';
import { SecurityTestingModalComponent } from './security-testing-modal.component';

const fakeRequest: ITestServiceRequest = {
  options: {
    url: 'https://',
    method: 'GET',
  },
  authInfo: new OAuth2Data(),
};

describe('SecurityTestingModalComponent', () => {
  let component: SecurityTestingModalComponent;
  let fixture: ComponentFixture<SecurityTestingModalComponent>;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityTestingModalComponent],
      providers: [
        ...basicStubsForTests,
        GatewayService, // GatewayService is mocked in individual tests.
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityTestingModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain “Test the service”', () => {
    expect(element.textContent).toContain('Test the service');
  });

  it('should contain a <h2> saying “Test the service”', () => {
    const heading = element.querySelector('h2');
    expect(heading.textContent).toEqual('Test the service');
  });

  it('should contain a <form>, with inputs and labels', () => {
    const forms = element.querySelectorAll('form');
    expect(forms.length).toBe(1);
  });

  it('should have inputs and labels in the form', () => {
    const inputs = element.querySelectorAll('form input');
    expect(inputs.length).toBe(2);

    const labels = element.querySelectorAll('form label[for]');
    expect(labels.length).toBe(2);
    expect(labels[0].textContent).toBe('URL');
    expect(labels[1].textContent).toBe('Method');
  });

  it('should have a “Get response” button', () => {
    const buttons = element.querySelectorAll('form button[type="submit"]');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent.trim()).toBe('Get response');
  });

  it('should get a response and display it in a textarea', fakeAsync(() => {
    component.request = fakeRequest;
    component.frmTest.controls['url'].setValue('https://');
    component.frmTest.controls['method'].setValue('GET');

    const textarea = element.querySelector('textarea');
    expect(textarea).toBeTruthy();

    const button = element.querySelector('form button[type="submit"]');
    expect(button).toBeTruthy();

    // Mock the service-method with a spy.
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    const spy = spyOn(gatewayService, 'testService').and.callFake(() =>
      of({ example: 'Some data from an API' }).pipe(delay(2000))
    );

    // Before the button has been clicked, there should be no response.
    expect(component.response).toBe('');
    expect(textarea.value.trim()).toBe('');

    // Click the button!
    button.dispatchEvent(new Event('click'));

    // After one second, we should be waiting for a response.
    tick(1000);
    fixture.detectChanges();

    expect(component.response).toBe('');
    expect(textarea.value.trim()).toBe('');

    // After another second, we should have a response.
    tick(1000);
    fixture.detectChanges();

    expect(component.response).toBe(`{"example":"Some data from an API"}`);
    expect(textarea.value).toBe(`{"example":"Some data from an API"}`);
    expect(spy).toHaveBeenCalled();
  }));

  it('should show a spinning icon when the response is loading', fakeAsync(() => {
    component.request = fakeRequest;
    component.frmTest.controls['url'].setValue('https://');
    component.frmTest.controls['method'].setValue('GET');

    const button = element.querySelector('form button[type="submit"]');
    expect(button).toBeTruthy();

    let icon = button.querySelector('i');
    expect(icon).toBeFalsy();

    // Mock the service-method with a spy.
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'testService').and.callFake(() =>
      of({}).pipe(delay(2000))
    );

    // Before the button has been clicked, the component should not be busy (it should not be waiting for a response).
    expect(component.isBusy).toBeFalsy();
    expect(icon).toBeFalsy();

    // Click the button!
    button.dispatchEvent(new Event('click'));

    // After one second, we should be waiting for a response.
    // The icon should be present and spinning.
    tick(1000);
    fixture.detectChanges();
    icon = button.querySelector('i');

    expect(component.isBusy).toBe(true);
    expect(icon).toBeTruthy();
    expect(icon.classList).toContain('fa-spin');

    // After another second, we should have a response.
    tick(1000);
    fixture.detectChanges();
    icon = button.querySelector('i');

    expect(component.isBusy).toBe(false);
    expect(icon).toBeFalsy();
  }));
});

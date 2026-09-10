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

import { GatewayService } from '@app/gateway/gateway-service/gateway.service';
import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import {
  OAuth2Data,
  SecurityDefinition,
} from '@app/gateway/gateway-service/defs';
import { SecurityListPageComponent } from './security-list-page.component';

const fakeSecurityDefinition: SecurityDefinition = {
  id: '123',
  name: 'Example definition',
  url: 'http://',
  authType: '',
  authInfo: new OAuth2Data(),
};

describe('SecurityListPageComponent', () => {
  let component: SecurityListPageComponent;
  let fixture: ComponentFixture<SecurityListPageComponent>;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityListPageComponent],
      providers: [
        HttpClient,
        HttpHandler,
        ...basicStubsForTests,
        GatewayService, // GatewayService is mocked in individual tests.
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityListPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain “List of security definitions”', () => {
    expect(element.textContent).toContain('List of security definitions');
  });

  it('should contain a <h2> saying “List of security definitions”', () => {
    const heading = element.querySelector('h2');
    expect(heading.textContent).toEqual('List of security definitions');
  });

  it('should say “Loading” while security definitions are loading', () => {
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'getList').and.callFake(() =>
      of([fakeSecurityDefinition]).pipe(delay(2000))
    );

    fixture.detectChanges();
    expect(element.textContent).toContain('Loading');
  });

  it('should not show any security definitions or “Add security definition” buttons while security definitions are loading', () => {
    const links = element.querySelectorAll('a');
    expect(links.length).toBe(0);
  });

  it('should render correctly when loading finishes with no security definitions', fakeAsync(() => {
    // Mocking service-call for the security definitions (taking one second).
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'getList').and.callFake(() =>
      of([]).pipe(delay(1000))
    );

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(component.loading).toEqual(false);
    expect(element.textContent).toContain(
      'List of security definitions There are no security definitions. Add a security definition'
    );
    expect(element.querySelector('p').textContent).toContain(
      'There are no security definitions'
    );
    // Each security definition is rendered as <article> containing <h3> and other elements.
    expect(element.querySelector('article, h3')).toBeFalsy();
    const links = element.querySelectorAll('a');
    expect(links.length).toBe(2);
    expect(links[0].textContent.trim()).toEqual('Add a security definition');
    expect(links[1].textContent.trim()).toEqual('Service Directory Home');
  }));

  it('should say it’s loading, then show the security definitions', fakeAsync(() => {
    // Mocking service-call for the security definitions (taking two seconds).
    const gatewayService = fixture.debugElement.injector.get(GatewayService);
    spyOn(gatewayService, 'getList').and.callFake(() =>
      of([fakeSecurityDefinition]).pipe(delay(2000))
    );

    // After one second, the security definitions should still be loading.
    fixture.detectChanges();
    tick(1000);

    expect(component.loading).toEqual(true);
    expect(element.textContent).toEqual(
      'List of security definitionsLoading security definitions…'
    );
    expect(element.querySelector('p').textContent).toEqual(
      'Loading security definitions…'
    );

    // After another second, the security definitions should have loaded.
    tick(1000);
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.definitions).toEqual([fakeSecurityDefinition]);

    expect(element.querySelector('h2').textContent.trim()).toEqual(
      'List of security definitions'
    );
    // expect(element.querySelector('p').textContent.trim()).toEqual(
    //   'Below are all the security definitions in the directory.'
    // );
    expect(element.querySelector('article h3').textContent.trim()).toEqual(
      'Example definition'
    );
    expect(
      element.querySelector('a:not(article a)').textContent.trim()
    ).toEqual('Add a security definition');
  }));
});

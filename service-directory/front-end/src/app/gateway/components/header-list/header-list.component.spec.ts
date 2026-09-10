import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderListComponent } from './header-list.component';
import { GatewayService } from '@app/gateway/gateway-service/gateway.service';
import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { HeaderInfo } from '@app/gateway/gateway-service/defs';

const fakeHeader: HeaderInfo = {
  name: 'Example header',
  value: 'Value',
};

describe('HeaderListComponent', () => {
  let component: HeaderListComponent;
  let fixture: ComponentFixture<HeaderListComponent>;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderListComponent],
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
    fixture = TestBed.createComponent(HeaderListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain “Headers+NameValue”', () => {
    expect(element.textContent).toContain('Headers+NameValue');
  });

  it('should contain a <legend> saying “Headers”', () => {
    const heading = element.querySelector('fieldset legend');
    expect(heading.textContent).toEqual('Headers');
  });

  it('should contain a <table> with a button in the <thead> for adding a row', () => {
    const button = element.querySelector('table thead tr button');
    expect(button.textContent).toEqual('+');
    expect(button.getAttribute('title')).toEqual('Add header');
  });
});

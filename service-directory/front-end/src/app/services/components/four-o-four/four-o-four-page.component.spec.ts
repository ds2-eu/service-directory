import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { ServicesListComponent } from '../services-list/services-list.component';
import { FourOFourPageComponent } from './four-o-four-page.component';

describe('FourOFourComponent', () => {
  let component: FourOFourPageComponent;
  let fixture: ComponentFixture<FourOFourPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FourOFourPageComponent, ServicesListComponent],
      providers: [HttpClient, HttpHandler, basicStubsForTests],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourOFourPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    expect(element.querySelector('h1')?.textContent).toEqual(
      'Service Directory — Page not found'
    );
  });

  it('should have a paragraph saying a page was not found', () => {
    expect(element.querySelector('main p')?.textContent).toEqual(
      'The page you wanted does not exist.'
    );
  });

  it('should have a link to go home in a second paragraph', () => {
    const link = element.querySelector('main p + p a');
    expect(link?.textContent).toEqual('Home');
    expect(link?.getAttribute('href')).toEqual('/');
  });
});

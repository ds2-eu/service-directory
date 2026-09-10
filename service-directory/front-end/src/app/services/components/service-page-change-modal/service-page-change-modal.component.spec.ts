import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServicesService } from '@app/services/services-service/services.service';
import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { ServicePageChangeModalComponent } from './service-page-change-modal.component';

describe('ServicePageChangeModalComponent', () => {
  let component: ServicePageChangeModalComponent;
  let fixture: ComponentFixture<ServicePageChangeModalComponent>;
  let element: HTMLElement;
  let servicesService: ServicesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServicePageChangeModalComponent],
      providers: [...basicStubsForTests, ServicesService],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicePageChangeModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    servicesService = fixture.debugElement.injector.get(ServicesService);
    component.service = {
      name: 'Test service',
      openApiYamlEndpoint: null,
      openApiDefinition: null,
      hideFromOrchestration: false,
      __v: 0,
      _id: '123',
    };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a <h2> saying “Unsaved changes”', () => {
    const heading = element.querySelector('h2');
    expect(heading?.textContent).toEqual('Unsaved changes');
  });

  it('should have a Close button in the modal header', () => {
    const buttons = element.querySelectorAll('.modal-header button');
    expect(buttons?.length).toBe(1);
    const otherControls = element.querySelectorAll('a');
    expect(otherControls?.length).toBe(0);

    expect(buttons[0].textContent.trim()).toBe('');
    expect(buttons[0].getAttribute('aria-label')).toBe('Close');
  });

  it('should contain “You have unsaved changes” etc', () => {
    expect(element.textContent).toContain(
      'You have unsaved changes to “Test service”.'
    );
    expect(element.textContent).toContain('Would you like to:');
  });

  it('should have two buttons and no other controls in the modal body', () => {
    const buttons = element.querySelectorAll('.modal-body button');
    expect(buttons?.length).toBe(2);
    const otherControls = element.querySelectorAll('a');
    expect(otherControls?.length).toBe(0);

    expect(buttons[0].textContent.trim()).toBe('Save and go to Authentication');
    expect(buttons[1].textContent.trim()).toBe('Continue editing');
  });

  it('should call `closeModal` when first button is clicked', () => {
    const buttons = element.querySelectorAll('button');
    spyOn(component, 'closeModal');

    buttons[0].click();

    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should call `closeModal` when second button is clicked', () => {
    const buttons = element.querySelectorAll('button');
    spyOn(component, 'closeModal');

    buttons[1].click();

    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should call `closeModal` when third button is clicked', () => {
    const buttons = element.querySelectorAll('button');
    spyOn(component, 'closeModal');

    buttons[2].click();

    expect(component.closeModal).toHaveBeenCalled();
  });
});

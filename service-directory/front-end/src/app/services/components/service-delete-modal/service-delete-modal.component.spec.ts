import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';

import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { ServicesService } from '@app/services/services-service/services.service';
import { Service } from '@app/services/services-service/service.interface';
import { ServiceDeleteModalComponent } from './service-delete-modal.component';

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

describe('ServiceDeleteModalComponent', () => {
  let component: ServiceDeleteModalComponent;
  let fixture: ComponentFixture<ServiceDeleteModalComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceDeleteModalComponent],
      providers: [
        BsModalRef,
        FormBuilder,
        HttpClient,
        HttpHandler,
        ...basicStubsForTests,
      ],
      imports: [FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDeleteModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render heading', () => {
    expect(element.querySelector('h2')?.textContent).toEqual(
      'Delete the service'
    );
  });

  it('should close the modal when the Close button is clicked', () => {
    component.service = fakeService;
    fixture.detectChanges();

    const servicesService = fixture.debugElement.injector.get(ServicesService);
    const deleteSpy = spyOn(servicesService, 'deleteService').and.returnValue(
      of(fakeService)
    );
    const submitSpy = spyOn(component, 'onSubmit');
    const closeModalSpy = spyOn(component, 'closeModal');

    const button = element.querySelector('button:not([type="submit"])');
    expect(button).toBeTruthy();

    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // Modal should have been closed but the service should not have been deleted.
    expect(submitSpy).not.toHaveBeenCalled();
    expect(closeModalSpy).toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('should render Close and Delete buttons', () => {
    component.service = fakeService;
    fixture.detectChanges();

    const buttons = element.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0]?.textContent).toEqual('');
    expect(buttons[0]?.attributes['aria-label'].value).toEqual('Close');
    expect(buttons[0]?.attributes['type'].value).toEqual('button');
    expect(buttons[1]?.textContent).toEqual('Delete');
    expect(buttons[1]?.attributes['type'].value).toEqual('submit');
  });

  it('should delete the service & close the modal when the Delete button is clicked', fakeAsync(() => {
    component.service = fakeService;
    fixture.detectChanges();

    const servicesService = fixture.debugElement.injector.get(ServicesService);
    const deleteSpy = spyOn(servicesService, 'deleteService').and.returnValue(
      of(fakeService)
    );
    // Using `callThrough` because `onSubmit` needs to call `closeModal` which needs to call `modalRef.hide`
    const submitSpy = spyOn(component, 'onSubmit').and.callThrough();
    const closeModalSpy = spyOn(component, 'closeModal').and.callThrough();
    const closeModalRefSpy = spyOn(component.modalRef, 'hide');

    const form = element.querySelector('form');
    expect(form).toBeTruthy();

    // Modal should not be closed before the form is submitted.
    expect(submitSpy).not.toHaveBeenCalled();
    expect(closeModalSpy).not.toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();

    // `submit` event doesn’t work here, it has to be `ngSubmit`.
    form.dispatchEvent(new Event('ngSubmit'));

    // Modal should have been closed.
    expect(submitSpy).toHaveBeenCalled();
    expect(closeModalSpy).toHaveBeenCalled();
    expect(closeModalRefSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();

    expect(component.errorFromBackendOnDelete).toBeFalsy();
  }));
});

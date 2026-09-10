import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { delay, of } from 'rxjs';

import { DefinitionEditComponent } from './definition-edit.component';
import { DefinitionsService, IDefinition } from '@app/core/definitions';
import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { SpinButtonComponent } from '@app/shared/spin-button/spin-button.component';

const fakeDefinition: IDefinition = {
  id: '123',
  name: 'Test definition',
  value: 'something for the value',
};

describe('DefinitionEditComponent', () => {
  let component: DefinitionEditComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<DefinitionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefinitionEditComponent],
      providers: [
        DefinitionsService, // DefinitionsService is mocked in individual tests.
        FormBuilder,
        HttpClient,
        HttpHandler,
        SpinButtonComponent,
        ...basicStubsForTests,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DefinitionEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have any buttons if the definition hasn’t loaded', () => {
    expect(element.querySelector('button')).toBe(null);
  });

  it('should render Loading, then render form', fakeAsync(() => {
    const definitionsService =
      fixture.debugElement.injector.get(DefinitionsService);
    spyOn(definitionsService, 'getDefinitionById').and.callFake(() => {
      return of(fakeDefinition).pipe(delay(2000));
    });

    fixture.detectChanges();
    tick(1000);
    expect(component.loading).toEqual(true);
    expect(element.textContent).toEqual('Loading…');

    tick(1000);
    fixture.detectChanges();
    expect(component.loading).toEqual(false);
    expect(component.record).toEqual(fakeDefinition);
    expect(element.textContent).toContain(
      'Fields marked with an asterisk are required. Name * Value *'
    );
  }));

  it('should render a form with two inputs', fakeAsync(() => {
    const definitionsService =
      fixture.debugElement.injector.get(DefinitionsService);
    spyOn(definitionsService, 'getDefinitionById').and.callFake(() =>
      of(fakeDefinition)
    );

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    expect(component.record).toEqual(fakeDefinition);

    const inputs = element.querySelectorAll('form input, form textarea');
    expect(inputs.length).toBe(2);
    expect(inputs[0].tagName).toBe('INPUT');
    expect(inputs[1].tagName).toBe('TEXTAREA');
    expect(inputs[0].getAttribute('formcontrolname')).toBe('name');
    expect(inputs[1].getAttribute('formcontrolname')).toBe('value');

    expect(component.editForm.get('name').value).toBe('Test definition');
    expect(component.editForm.get('value').value).toBe(
      'something for the value'
    );
  }));
});

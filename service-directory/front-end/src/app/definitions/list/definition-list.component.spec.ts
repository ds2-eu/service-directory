import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, delay } from 'rxjs';

import { DefinitionListComponent } from './definition-list.component';
import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { DefinitionsService, IDefinition } from '@app/core/definitions';

const fakeDefinition: IDefinition = {
  id: '123',
  name: 'Test definition',
  value: 'something for the value',
};

describe('DefinitionListComponent', () => {
  let component: DefinitionListComponent;
  let fixture: ComponentFixture<DefinitionListComponent>;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DefinitionListComponent],
      providers: [
        HttpClient,
        HttpHandler,
        ...basicStubsForTests,
        DefinitionsService, // DefinitionsService is mocked in individual tests.
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain “List of definitions”', () => {
    expect(element.textContent).toContain('List of definitions');
  });

  it('should contain a <h2> saying “List of definitions”', () => {
    const heading = element.querySelector('h2');
    expect(heading.textContent).toEqual('List of definitions');
  });

  it('should say “Loading” while definitions are loading', fakeAsync(() => {
    const definitionsService =
      fixture.debugElement.injector.get(DefinitionsService);
    spyOn(definitionsService, 'getDefinitions').and.callFake(() =>
      of([fakeDefinition]).pipe(delay(2000))
    );
    tick(1000);
    fixture.detectChanges();

    expect(element.textContent).toContain('Loading');

    tick(2000);
    fixture.detectChanges();

    expect(element.textContent).not.toContain('Loading');
  }));

  it('should not show any definitions or “Add definition” buttons while definitions are loading', fakeAsync(() => {
    // Mocking service-call for the definitions (taking two seconds).
    const definitionsService =
      fixture.debugElement.injector.get(DefinitionsService);
    spyOn(definitionsService, 'getDefinitions').and.callFake(() =>
      of([fakeDefinition]).pipe(delay(2000))
    );
    tick(1000);
    fixture.detectChanges();

    const links = element.querySelectorAll('a');
    expect(links.length).toBe(0);

    // This is apparently needed to avoid getting the error:
    // Error: 1 periodic timer(s) still in the queue.
    discardPeriodicTasks();
  }));

  it('should render correctly when loading finishes with no definitions', fakeAsync(() => {
    // Mocking service-call for the definitions (taking one second).
    const definitionsService =
      fixture.debugElement.injector.get(DefinitionsService);
    spyOn(definitionsService, 'getDefinitions').and.callFake(() =>
      of([]).pipe(delay(1000))
    );

    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(component.loading).toEqual(false);
    expect(element.textContent).toContain(
      'List of definitions There are no definitions.  Add a definition'
    );
    expect(element.querySelector('p').textContent).toContain(
      'There are no definitions'
    );
    expect(element.querySelector('ul')).toBeFalsy();
    const links = element.querySelectorAll('a');
    expect(links.length).toBe(1);
    expect(links[0].textContent.trim()).toEqual('Add a definition');
  }));

  it('should say it’s loading, then show the definitions', fakeAsync(() => {
    // Mocking service-call for the definitions (taking two seconds).
    const definitionsService =
      fixture.debugElement.injector.get(DefinitionsService);
    spyOn(definitionsService, 'getDefinitions').and.callFake(() =>
      of([fakeDefinition]).pipe(delay(2000))
    );

    // After one second, the definitions should still be loading.
    fixture.detectChanges();
    tick(1000);

    expect(component.loading).toEqual(true);
    expect(element.textContent).toEqual(
      'List of definitionsLoading definitions…'
    );
    expect(element.querySelector('p').textContent).toEqual(
      'Loading definitions…'
    );

    // After another second, the definitions should have loaded.
    tick(1000);
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    component.records$.subscribe((records) => {
      expect(records).toEqual([fakeDefinition]);
    });

    expect(element.querySelector('h2').textContent.trim()).toEqual(
      'List of definitions'
    );
    expect(element.querySelector('p').textContent.trim()).toEqual(
      'Below are all the definitions in the directory.'
    );
    expect(element.querySelector('ul li').textContent.trim()).toEqual(
      'Test definition'
    );
    expect(element.querySelector('a:not(ul a)').textContent.trim()).toEqual(
      'Add a definition'
    );

    // This is apparently needed to avoid getting the error:
    // Error: 1 periodic timer(s) still in the queue.
    discardPeriodicTasks();
  }));
});

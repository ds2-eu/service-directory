import { ComponentFixture, TestBed } from '@angular/core/testing';

import basicStubsForTests from '@app/core/testing/basic-stubs-for-tests';
import { SpinButtonComponent } from './spin-button.component';

describe('SpinButtonComponent', () => {
  let fixture: ComponentFixture<SpinButtonComponent>;
  let component: SpinButtonComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...basicStubsForTests],
    });

    fixture = TestBed.createComponent(SpinButtonComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have one <button> element', () => {
    const buttons = element.querySelectorAll('button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].tagName).toBe('BUTTON');
  });

  it('should raise a click event when the button is clicked', () => {
    const button = element.querySelector('button');
    const spy = spyOn(component.click, 'next');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should show an icon that spins when the component is busy', () => {
    let icon = element.querySelector('button i');
    expect(icon).toBeTruthy();

    // Before the button has been clicked, the component should not be busy (looking like it’s doing anything).
    expect(component.working).toBeFalsy();
    expect(icon.classList).not.toContain('fa-spin');

    // spin-button is not responsible for setting its own `working` property,
    // which is controlled from outside the component.
    // Clicking the button should set `working` to true. Let’s simulate that.
    component.working = true;
    fixture.detectChanges();

    // The icon should now be spinning.
    expect(component.working).toBe(true);
    expect(icon.classList).toContain('fa-spin');

    // Simulate the completion of whatever the button does.
    component.working = false;
    fixture.detectChanges();

    expect(component.working).toBe(false);
    expect(icon.classList).not.toContain('fa-spin');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicAlerts } from './basic-alerts';

describe('BasicAlerts', () => {
  let component: BasicAlerts;
  let fixture: ComponentFixture<BasicAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicAlerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Signal Logic (Unit)', () => {
    it('should show default title and message initially', () => {
      expect(component.effectiveTitle()).toBe('Default Alert');
      expect(component.effectiveMessage()).toBe('This is a default alert with important information.');
    });

    it('should swap to error defaults when alertType is "error"', () => {
      fixture.componentRef.setInput('alertType', 'error');
      expect(component.effectiveTitle()).toBe('Error Alert');
      expect(component.effectiveMessage()).toBe('This is an error alert with important information.');
    });

    it('should calculate the correct BEM class', () => {
      fixture.componentRef.setInput('alertType', 'error');
      expect(component.alertClass()).toBe('basic-alert--error');
    });
  });

  describe('DOM Integration (Rendering)', () => {
    it('should apply the BEM class to the host element', () => {
      fixture.componentRef.setInput('alertType', 'error');
      fixture.detectChanges();

      const host = fixture.nativeElement.querySelector('.basic-alert');
      expect(host.classList).toContain('basic-alert--error');
    });

    it('should render the effective title in the UI', () => {
      fixture.componentRef.setInput('alertType', 'error');
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.basic-alert__title');
      expect(titleElement.textContent).toBe('Error Alert');
    });

    it('should render custom message when provided', () => {
      const customMsg = 'User saved successfully';
      fixture.componentRef.setInput('alertMessage', customMsg);
      fixture.detectChanges();

      const msgElement = fixture.nativeElement.querySelector('.basic-alert__message');
      expect(msgElement.textContent).toBe(customMsg);
    });
  });
});
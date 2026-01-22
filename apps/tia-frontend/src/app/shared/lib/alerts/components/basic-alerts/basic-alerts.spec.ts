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

  describe('Custom Input Overrides', () => {
    it('should show default title and message initially', () => {
      expect(component.effectiveTitle()).toBe('Default Alert');
      expect(component.effectiveMessage()).toBe(
        'This is a default alert with important information.',
      );
    });

    it('should swap to error defaults when alertType is "error"', () => {
      fixture.componentRef.setInput('alertType', 'error');

      expect(component.effectiveTitle()).toBe('Error Alert');
      expect(component.effectiveMessage()).toBe(
        'This is an error alert with important information.',
      );
    });

    it('should use custom title and message when provided', () => {
      fixture.componentRef.setInput('alertType', 'error');
      fixture.componentRef.setInput('alertTitle', 'Custom Error Title');
      fixture.componentRef.setInput(
        'alertMessage',
        'Custom error message content.',
      );

      expect(component.effectiveTitle()).toBe('Custom Error Title');
      expect(component.effectiveMessage()).toBe(
        'Custom error message content.',
      );
    });

    it('should show custom title even when type is default', () => {
      fixture.componentRef.setInput('alertTitle', 'Just a heads up');
      
      expect(component.effectiveTitle()).toBe('Just a heads up');
    });
  });
});

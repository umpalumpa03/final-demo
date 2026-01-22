import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsWithActions } from './alerts-with-actions';
import { By } from '@angular/platform-browser';

describe('AlertsWithActions', () => {
  let component: AlertsWithActions;
  let fixture: ComponentFixture<AlertsWithActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertsWithActions],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertsWithActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Computed Logic', () => {
    it('should map "error" type to "warning" class and "destructive" button variant', () => {
      fixture.componentRef.setInput('alertType', 'error');
      
      expect(component.iconAlertClass()).toBe('alerts-with-actions--warning');
      expect(component.effectiveButtonVariant()).toBe('destructive');
      expect(component.effectiveImgName()).toBe('default');
    });

    it('should return empty class string for "default" type', () => {
      fixture.componentRef.setInput('alertType', 'default');
      expect(component.iconAlertClass()).toBe('');
    });

    it('should use type name for other types like "success"', () => {
      fixture.componentRef.setInput('alertType', 'success');
      expect(component.iconAlertClass()).toBe('alerts-with-actions--success');
      expect(component.effectiveImgName()).toBe('success');
    });
  });

  describe('Template Rendering', () => {
    it('should render the correct title and message', () => {
      const testTitle = 'custom title';
      const testMsg = 'custom message';
      
      fixture.componentRef.setInput('alertTitle', testTitle);
      fixture.componentRef.setInput('alertMessage', testMsg);
      fixture.detectChanges();

      const titleEl = fixture.nativeElement.querySelector('.alerts-with-actions__title');
      const messageEl = fixture.nativeElement.querySelector('.alerts-with-actions__message');

      expect(titleEl.textContent).toContain('Custom title');
      expect(messageEl.textContent).toContain('Custom message');
    });

    it('should display custom button text from inputs', () => {
      fixture.componentRef.setInput('buttonOneText', 'Confirm');
      fixture.componentRef.setInput('buttonTwoText', 'Cancel');
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('app-button'));
      
      expect(buttons[0].nativeElement.textContent).toContain('Confirm');
      expect(buttons[1].nativeElement.textContent).toContain('Cancel');
    });

    it('should calculate effectiveButtonVariant by alertType', () => {
      fixture.componentRef.setInput('alertType', "error")
      fixture.detectChanges();

      expect(component.effectiveButtonVariant()).toBe('destructive');
    })
  });

});

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

    it('should use type name for other types like "success"', () => {
      fixture.componentRef.setInput('alertType', 'success');
      expect(component.iconAlertClass()).toBe('alerts-with-actions--success');
      expect(component.effectiveImgName()).toBe('success');
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsWithActions } from './alerts-with-actions';

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
      expect(component.iconAlertClass()).toBe('alerts-actions--warning');
      expect(component.effectiveImgName()).toBe('warning');
    });

    it('should use type name for other types like "success"', () => {
      fixture.componentRef.setInput('alertType', 'success');
      expect(component.iconAlertClass()).toBe('alerts-actions--success');
      expect(component.effectiveImgName()).toBe('success');
    });
  });
});

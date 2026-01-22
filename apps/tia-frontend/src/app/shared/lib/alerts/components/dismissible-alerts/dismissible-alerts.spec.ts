import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DismissibleAlerts } from './dismissible-alerts';

describe('DismissibleAlerts', () => {
  let component: DismissibleAlerts;
  let fixture: ComponentFixture<DismissibleAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DismissibleAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(DismissibleAlerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Computed Logic', () => {
    it('should calculate effectiveImgName based on type', () => {
      fixture.componentRef.setInput('alertType', 'error');
      expect(component.effectiveImgName()).toBe('default');

      fixture.componentRef.setInput('alertType', 'success');
      expect(component.effectiveImgName()).toBe('success');
    });

    it('should calculate the correct BEM class based on type', () => {
      fixture.componentRef.setInput('alertType', 'warning');
      expect(component.iconAlertClass()).toBe('dismissible-alerts--warning');
    });
  });

  describe('Dismissal Behavior', () => { 
    it('should have isDismissed as false by default', () => {
      expect(component.isDismissed()).toBe(false);
    });

    it('should set isDismissed to true when onDismiss is called', () => {
      component.onDismiss();
      expect(component.isDismissed()).toBe(true);
    });

    it('should physically remove the alert from the DOM when dismissed', () => {
      let alertDiv = fixture.nativeElement.querySelector('.dismissible-alerts');
      expect(alertDiv).toBeTruthy();

      const closeBtn = fixture.nativeElement.querySelector('.dismissible-alerts__close-button');
      closeBtn.click();

      fixture.detectChanges();

      alertDiv = fixture.nativeElement.querySelector('.dismissible-alerts');
      expect(alertDiv).toBeNull();
    });
  });
});

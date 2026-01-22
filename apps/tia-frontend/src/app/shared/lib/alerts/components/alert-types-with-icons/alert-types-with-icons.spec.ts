import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertTypesWithIcons } from './alert-types-with-icons';

describe('AlertTypesWithIcons', () => {
  let component: AlertTypesWithIcons;
  let fixture: ComponentFixture<AlertTypesWithIcons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertTypesWithIcons],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertTypesWithIcons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('effectiveImgName Computed Property', () => {
    it('should convert effectiveImgName if alertType is success', () => {
      fixture.componentRef.setInput('alertType', 'success');
      fixture.detectChanges();
      expect(component.effectiveImgName()).toBe('success');
    });

    it('should convert effectiveImgName if alertType is warning', () => {
      fixture.componentRef.setInput('alertType', 'warning');
      fixture.detectChanges();
      expect(component.effectiveImgName()).toBe('warning');
    });

    it('should convert effectiveImgName if alertType is error or information', () => {
      fixture.componentRef.setInput('alertType', 'error');
      fixture.detectChanges();
      expect(component.effectiveImgName()).toBe('default');
    });
    it('should convert effectiveImgName if alertType is information', () => {
      fixture.componentRef.setInput('alertType', 'information');
      fixture.detectChanges();
      expect(component.effectiveImgName()).toBe('default');
    });
  });
});

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

    it('should calculate the correct BEM class string', () => {
      fixture.componentRef.setInput('alertType', 'warning');
      expect(component.iconAlertClass()).toBe('alert-types-icons--warning');
    });
  });

  describe('Template Rendering', () => {
    it('should physically apply the BEM modifier class to the host element', () => {
      fixture.componentRef.setInput('alertType', 'error');
      fixture.detectChanges();

      const hostElement: HTMLElement =
        fixture.nativeElement.querySelector('.alert-types-icons');
      expect(hostElement.classList).toContain('alert-types-icons--error');
    });

    it('should set the correct img src path in the DOM', () => {
      fixture.componentRef.setInput('alertType', 'success');
      fixture.detectChanges();

      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.src).toContain(
        '/images/img/alert-icons/base-alert-success.png',
      );
    });

    it('should use default image for information type', () => {
      fixture.componentRef.setInput('alertType', 'information');
      fixture.detectChanges();

      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.src).toContain(
        '/images/img/alert-icons/base-alert-default.png',
      );
    });
  });
});

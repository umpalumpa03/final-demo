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
  });

  describe('Template Rendering', () => {
    it('should set the correct img src path in the DOM', () => {
      fixture.componentRef.setInput('alertType', 'success');
      fixture.detectChanges();

      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.src).toContain('/images/svg/alerts/base-alert-success.svg');
    });
  });
});

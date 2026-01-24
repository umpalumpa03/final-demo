import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alerts } from './alerts';
import { ALERTS_TITLES } from '../config/alerts-data.config';

describe('Alerts', () => {
  let component: Alerts;
  let fixture: ComponentFixture<Alerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alerts],
    }).compileComponents();

    fixture = TestBed.createComponent(Alerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('effectiveTitle()', () => {
    it('should return empty string when section is DISMISSIBLE', () => {
      const result = component.effectiveTitle(ALERTS_TITLES.DISMISSIBLE);
      expect(result).toBe('');
    });

    it('should return the section name for any other section', () => {
      const result = component.effectiveTitle(ALERTS_TITLES.BASIC);
      expect(result).toBe(ALERTS_TITLES.BASIC);
    });
  });

  describe('Logic: onResetAll', () => {
    it('should set isDismissed to false for all dismissible alerts', () => {
      component.alertComponents.forEach(alert => {
        alert.isDismissed.set(true);
      });

      component.onResetAll();
      fixture.detectChanges()

      component.alertComponents.forEach(alert => {
        expect(alert.isDismissed()).toBe(false);
      });
    });
  });
});

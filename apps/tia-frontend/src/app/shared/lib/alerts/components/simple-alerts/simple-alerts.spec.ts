import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleAlerts } from './simple-alerts';

describe('SimpleAlerts', () => {
  let component: SimpleAlerts;
  let fixture: ComponentFixture<SimpleAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleAlerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Computed Logic', () => {
    it('should apply the correct modifier class in the DOM', () => {
      fixture.componentRef.setInput('alertType', 'warning');
      fixture.detectChanges();
      expect(component.iconAlertClass()).toBe('simple-alerts--warning')
    });

    it('should map information type to default image name', () => {
      fixture.componentRef.setInput('alertType', 'information');
      expect(component.effectiveImgName()).toBe('default');
    });
  });
});

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
      fixture.componentRef.setInput('alertType', 'success');
      expect(component.effectiveImgName()).toBe('success');
    });
  });
});

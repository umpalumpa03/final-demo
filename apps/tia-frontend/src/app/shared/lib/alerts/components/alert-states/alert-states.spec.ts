import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertStates } from './alert-states';

describe('AlertStates', () => {
  let component: AlertStates;
  let fixture: ComponentFixture<AlertStates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertStates],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertStates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate effectiveAlertState based on alertState', () => {
    expect(component.effectiveAlertState()).toBe('alert-states--default');
    fixture.componentRef.setInput('alertState', 'inactive');
    expect(component.effectiveAlertState()).toBe('alert-states--inactive');

    fixture.componentRef.setInput('alertState', 'active');
    expect(component.effectiveAlertState()).toBe('alert-states--active');
  });
});

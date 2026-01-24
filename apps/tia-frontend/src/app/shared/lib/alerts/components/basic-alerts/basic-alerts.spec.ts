import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicAlerts } from './basic-alerts';

describe('BasicAlerts', () => {
  let component: BasicAlerts;
  let fixture: ComponentFixture<BasicAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicAlerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply correct UI mapping for Error state', () => {
    fixture.componentRef.setInput('alertType', 'error');
    fixture.componentRef.setInput('alertState', 'active');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const container = el.querySelector('.basic-alert');

    expect(container?.classList).toContain('basic-alert--error');
    expect(container?.classList).toContain('basic-alert--active');
    
    expect(el.querySelector('.basic-alert__title')?.textContent).toBe('Error Alert');
    expect(component.effectiveMessage()).toContain('something went wrong');
  });

  it('should respect custom inputs', () => {
    fixture.componentRef.setInput('alertTitle', 'New Title');
    fixture.detectChanges();
    
    expect(component.effectiveTitle()).toBe('New Title');
  });
});
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

  describe('DOM Integration (Rendering)', () => {
    it('should render the effective title in the UI', () => {
      fixture.componentRef.setInput('alertType', 'error');
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.basic-alert__title');
      expect(titleElement.textContent).toBe('Error Alert');
    });
  });
});
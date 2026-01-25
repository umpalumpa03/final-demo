import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepperHeader } from './stepper-header';

describe('StepperHeader', () => {
  let component: StepperHeader;
  let fixture: ComponentFixture<StepperHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperHeader);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', [
      { label: 'From', key: 'from' },
      { label: 'To', key: 'to' },
    ]);
    fixture.componentRef.setInput('step', 1);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultistepForms } from './multistep-forms';
import { FormsDemoState } from '../state/forms-demo.state';
import { TranslateModule } from '@ngx-translate/core';
const mockFormsDemo = {
  stepForm: () => ([{ label: 'from', key: 'from' }, { label: 'to', key: 'to' }, { label: 'amount', key: 'amount' }]),
  multiForm: () => ({
    name: { label: 'Name', required: true, placeholder: '' },
    bio: { label: 'Bio', required: true, placeholder: '' },
  }),
};

describe('MultistepForms', () => {
  let component: MultistepForms;
  let fixture: ComponentFixture<MultistepForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultistepForms, TranslateModule.forRoot()],
      providers: [
        { provide: FormsDemoState, useValue: mockFormsDemo },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MultistepForms);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial navigation state', () => {
    expect(component.currentStep()).toBe(1);
    expect(component.canBack()).toBe(false);
    expect(component.canNext()).toBe(true);
    expect(component.isLastStep()).toBe(false);
    expect(component.currentStepConfig()).toEqual(component.stepsConfig()[0]);
  });

  it('should navigate next and previous and clamp at bounds', () => {
    const total = component.totalSteps();

    component.next();
    component.next();
    expect(component.currentStep()).toBe(total);
    expect(component.canNext()).toBe(false);
    expect(component.isLastStep()).toBe(true);

    component.next();
    expect(component.currentStep()).toBe(total);

    component.previous();
    expect(component.currentStep()).toBe(total - 1);
    expect(component.canBack()).toBe(true);
  });
});

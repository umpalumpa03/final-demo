import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentWizardContainer } from './prepayment-wizard-container';

describe('PrepaymentWizardContainer', () => {
  let component: PrepaymentWizardContainer;
  let fixture: ComponentFixture<PrepaymentWizardContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepaymentWizardContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaymentWizardContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

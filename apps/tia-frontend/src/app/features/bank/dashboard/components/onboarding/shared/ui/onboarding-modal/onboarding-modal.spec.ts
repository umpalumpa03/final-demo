import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingModal } from './onboarding-modal';

describe('OnboardingModal', () => {
  let component: OnboardingModal;
  let fixture: ComponentFixture<OnboardingModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingModal],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

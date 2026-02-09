import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Onboarding } from './onboarding';
import { Store } from '@ngrx/store';
import { signal } from '@angular/core';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Onboarding', () => {
  let component: Onboarding;
  let fixture: ComponentFixture<Onboarding>;
  let storeMock: any;

  beforeEach(async () => {
    storeMock = {
      dispatch: vi.fn(),
      selectSignal: vi.fn().mockReturnValue(signal(false)),
    };

    await TestBed.configureTestingModule({
      imports: [Onboarding],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Onboarding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should calculate isModalOpen correctly', () => {
    expect(component.isModalOpen()).toBe(true);

    component.isDismissed.set(true);
    expect(component.isModalOpen()).toBe(false);
  });

  it('should navigate pages correctly', () => {
    expect(component.currentPage()).toBe(1);

    component.onNext();
    expect(component.currentPage()).toBe(2);

    component.onPrev();
    expect(component.currentPage()).toBe(1);
  });

  it('should compute step data based on page', () => {
    expect(component.currentStepData().title).toBeTruthy();

    component.onNext();
    expect(component.currentStepData()).not.toEqual(component['steps'][0]);
  });

  it('should finish onboarding', () => {
    const closeSpy = vi.spyOn(component.close, 'emit');

    component.finishOnboarding();

    expect(component.isDismissed()).toBe(true);
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      UserInfoActions.updateOnboardingStatus({ completed: true }),
    );
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should finish onboarding when calling onNext on last page', () => {
    const finishSpy = vi.spyOn(component, 'finishOnboarding');

    component.currentPage.set(6);

    component.onNext();

    expect(finishSpy).toHaveBeenCalled();
  });
});

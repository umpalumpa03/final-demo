import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingModal } from './onboarding-modal';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('OnboardingModal', () => {
  let component: OnboardingModal;
  let fixture: ComponentFixture<OnboardingModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingModal, TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(OnboardingModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('desc', 'Test Desc');
    fixture.componentRef.setInput('page', 1);
    fixture.detectChanges();
  });

  it('should emit events on button clicks', () => {
    const nextSpy = vi.spyOn(component.next, 'emit');
    const skipSpy = vi.spyOn(component.skip, 'emit');

    fixture.debugElement
      .query(By.css('app-button[variant="default"]'))
      .nativeElement.click();
    expect(nextSpy).toHaveBeenCalled();

    fixture.debugElement.query(By.css('.skip-text')).nativeElement.click();
    expect(skipSpy).toHaveBeenCalled();
  });

  it('should show previous button on page > 1', () => {
    fixture.componentRef.setInput('page', 2);
    fixture.detectChanges();

    const prevBtn = fixture.debugElement.query(
      By.css('app-button[variant="outline"]'),
    );
    expect(prevBtn).toBeTruthy();

    const prevSpy = vi.spyOn(component.prev, 'emit');
    prevBtn.nativeElement.click();
    expect(prevSpy).toHaveBeenCalled();
  });

  it('should show Finish button on page 6', () => {
    fixture.componentRef.setInput('page', 6);
    fixture.detectChanges();

    const finishBtn = fixture.debugElement.query(
      By.css('app-button[variant="default"]'),
    );
    expect(finishBtn.nativeElement.textContent).toContain(
      'dashboard.onboarding.modal.finish',
    );
  });
});

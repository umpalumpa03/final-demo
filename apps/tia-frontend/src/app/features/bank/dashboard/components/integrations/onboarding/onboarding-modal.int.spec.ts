import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { OnboardingModal } from '../../onboarding/shared/ui/onboarding-modal/onboarding-modal';
import { ModalResponsiveService } from '@tia/shared/lib/overlay/ui-modal/services/service-modal';
import { createMockModalResponsiveService } from './onboarding.test-helpers';

describe('OnboardingModal Integration', () => {
  let component: OnboardingModal;
  let fixture: ComponentFixture<OnboardingModal>;
  let modalServiceMock: ReturnType<typeof createMockModalResponsiveService>;

  function setInputs(
    overrides: Partial<{
      page: number;
      title: string;
      desc: string;
      target: string | null;
    }> = {},
  ) {
    const defaults = {
      page: 1,
      title: 'test.title',
      desc: 'test.desc',
      target: null,
    };
    const merged = { ...defaults, ...overrides };
    fixture.componentRef.setInput('page', merged.page);
    fixture.componentRef.setInput('title', merged.title);
    fixture.componentRef.setInput('desc', merged.desc);
    if (merged.target !== null) {
      fixture.componentRef.setInput('target', merged.target);
    }
    fixture.detectChanges();
  }

  beforeEach(async () => {
    modalServiceMock = createMockModalResponsiveService();

    await TestBed.configureTestingModule({
      imports: [OnboardingModal, TranslateModule.forRoot()],
      providers: [
        { provide: ModalResponsiveService, useValue: modalServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingModal);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render title, description, and pill paging', () => {
    setInputs();

    expect(fixture.debugElement.query(By.css('.modal__title h1'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.modal__title p'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-pill-paging'))).toBeTruthy();
  });

  it('should compute correct offset and placement per target', () => {
    setInputs({ page: 2, target: 'onboard-sidebar' });
    expect(component.offset()).toEqual({ top: 100 });
    expect(component.placement()).toBe('right');

    setInputs({ page: 2, target: 'onboard-sidebar-mobile' });
    expect(component.offset()).toEqual({ left: 250 });
    expect(component.placement()).toBe('bottom');

    setInputs({ page: 3, target: 'onboard-messaging' });
    expect(component.offset()).toEqual({ left: -300 });
    expect(component.placement()).toBe('bottom');
  });

  it('should emit skip when skip text is clicked', () => {
    setInputs({ page: 2 });

    const skipSpy = vi.spyOn(component.skip, 'emit');
    const skipText = fixture.debugElement.query(By.css('.skip-text'));
    skipText.nativeElement.click();

    expect(skipSpy).toHaveBeenCalled();
  });

  it('should emit paging with 1-indexed value via goTo', () => {
    setInputs();

    const pagingSpy = vi.spyOn(component.paging, 'emit');
    component.goTo(3);

    expect(pagingSpy).toHaveBeenCalledWith(4);
  });

  it('should reset modal styles when target is null', () => {
    setInputs({ target: null });

    expect(modalServiceMock.cardStyle()).toBeNull();
    expect(modalServiceMock.spotlightStyle()).toBeNull();
  });
});

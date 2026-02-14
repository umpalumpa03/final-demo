import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { Onboarding } from '../../onboarding/onboarding';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import {
  createMockBreakpointService,
  createMockStore,
} from './onboarding.test-helpers';

describe('Onboarding Flow Integration', () => {
  let component: Onboarding;
  let fixture: ComponentFixture<Onboarding>;
  let storeMock: ReturnType<typeof createMockStore>;
  let breakpointMock: ReturnType<typeof createMockBreakpointService>;

  beforeEach(async () => {
    storeMock = createMockStore(false);
    breakpointMock = createMockBreakpointService(false);

    await TestBed.configureTestingModule({
      imports: [Onboarding, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: BreakpointService, useValue: breakpointMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Onboarding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render onboarding modal on init', () => {
    const modal = fixture.debugElement.query(By.css('app-onboarding-modal'));
    expect(modal).toBeTruthy();
  });

  it('should render navigation-hub only on page 2', () => {
    expect(
      fixture.debugElement.query(By.css('app-navigation-hub')),
    ).toBeFalsy();

    component.currentPage.set(2);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('app-navigation-hub')),
    ).toBeTruthy();
  });

  it('should render customizable-widgets only on page 5', () => {
    expect(
      fixture.debugElement.query(By.css('app-customizable-widgets')),
    ).toBeFalsy();

    component.currentPage.set(5);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('app-customizable-widgets')),
    ).toBeTruthy();
  });

  it('should not render modal when onboarding already completed', async () => {
    const completedStore = createMockStore(true);

    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [Onboarding, TranslateModule.forRoot()],
        providers: [
          { provide: Store, useValue: completedStore },
          { provide: BreakpointService, useValue: breakpointMock },
        ],
      })
      .compileComponents();

    const f = TestBed.createComponent(Onboarding);
    f.detectChanges();

    expect(f.debugElement.query(By.css('app-onboarding-modal'))).toBeFalsy();
  });

  it('should resolve correct target per page and breakpoint', () => {
    component.currentPage.set(2);
    expect(component.target()).toBe('onboard-sidebar');

    breakpointMock.isMobile.set(true);
    expect(component.target()).toBe('onboard-sidebar-mobile');

    component.currentPage.set(3);
    expect(component.target()).toBe('onboard-messaging');

    component.currentPage.set(4);
    expect(component.target()).toBe('onboard-notifications');

    component.currentPage.set(5);
    expect(component.target()).toBeUndefined();
  });

  it('should complete full walkthrough from page 1 to finish', () => {
    for (let i = 1; i <= 5; i++) {
      expect(component.currentPage()).toBe(i);
      component.onNext();
    }
    expect(component.currentPage()).toBe(6);

    component.onNext();

    expect(component.isDismissed()).toBe(true);
    expect(component.isModalOpen()).toBe(false);
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      UserInfoActions.updateOnboardingStatus({ completed: true }),
    );
  });
});

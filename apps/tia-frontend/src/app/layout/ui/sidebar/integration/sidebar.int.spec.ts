import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from '../container/sidebar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'apps/tia-frontend/src/app/core/auth/services/auth.service';
import { BreakpointService } from '../../../../core/services/breakpoints/breakpoint.service';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { userInfoFeature } from 'apps/tia-frontend/src/app/store/user-info/user-info.reducer';
import { ElementRef, signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';

describe('Sidebar Integration', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let store: MockStore;
  let mockAuth: any;
  let mockBreakpoint: any;
  let langChangeSubject: Subject<any>;

  function createMockBreakpoint(mobile = false, tablet = false) {
    return {
      isMobile: signal(mobile),
      isTablet: signal(tablet),
    };
  }

  async function stabilize() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    langChangeSubject = new Subject();

    mockAuth = {
      logout: vi.fn(() => of(null)),
    };

    mockBreakpoint = createMockBreakpoint();

    await TestBed.configureTestingModule({
      imports: [Sidebar, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideMockStore(),
        { provide: AuthService, useValue: mockAuth },
        { provide: BreakpointService, useValue: mockBreakpoint },
        {
          provide: ElementRef,
          useValue: { nativeElement: document.createElement('div') },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(userInfoFeature.selectRole, 'CONSUMER');

    const translate = TestBed.inject(TranslateService);
    Object.defineProperty(translate, 'onLangChange', {
      value: langChangeSubject,
    });

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize with navigation items', () => {
    expect(component).toBeTruthy();
    expect(component.items().length).toBeGreaterThan(0);
  });

  it('should initialize with default state', () => {
    expect(component.isCollapsed()).toBe(false);
    expect(component.isDropdownOpen()).toBe(false);
    expect(component.showLogoutConfirm()).toBe(false);
    expect(component.isLoggingOut()).toBe(false);
  });

  describe('Navigation Items', () => {
    it('should contain expected navigation routes for CONSUMER role', () => {
      const routes = component.items().map((item) => item.route);
      expect(routes).toContain('dashboard');
      expect(routes).toContain('products');
      expect(routes).toContain('transactions');
      expect(routes).toContain('transfers');
      expect(routes).toContain('loans');
      expect(routes).toContain('finances');
      expect(routes).toContain('settings');
    });

    it('should not contain storybook item for CONSUMER role', () => {
      const storybookItem = component
        .items()
        .find((item) => item.route?.includes('storybook'));
      expect(storybookItem).toBeFalsy();
    });

    it('should add storybook item for SUPPORT role', () => {
      store.overrideSelector(userInfoFeature.selectRole, 'SUPPORT');
      store.refreshState();
      fixture.detectChanges();

      (component as any).updateItems();

      const storybookItem = component
        .items()
        .find((item) => item.route?.includes('storybook'));
      expect(storybookItem).toBeTruthy();
    });

    it('should update navigation items on language change', () => {
      const updateSpy = vi.spyOn(component as any, 'updateItems');

      langChangeSubject.next({ lang: 'ka' });

      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('Collapse Behavior', () => {
    it('should toggle collapsed state', () => {
      expect(component.isCollapsed()).toBe(false);

      component.toggleCollapse();
      expect(component.isCollapsed()).toBe(true);

      component.toggleCollapse();
      expect(component.isCollapsed()).toBe(false);
    });

    it('should auto-collapse on tablet breakpoint', async () => {
      mockBreakpoint.isTablet.set(true);
      await stabilize();

      expect(component.isCollapsed()).toBe(true);
    });

    it('should not collapse on mobile breakpoint', async () => {
      mockBreakpoint.isMobile.set(true);
      await stabilize();

      expect(component.isCollapsed()).toBe(false);
    });

    it('should reset dropdown on mobile breakpoint', async () => {
      component.isDropdownOpen.set(true);

      mockBreakpoint.isMobile.set(true);
      await stabilize();

      expect(component.isDropdownOpen()).toBe(false);
    });
  });

  describe('Mobile Dropdown', () => {
    it('should toggle dropdown open and closed', () => {
      component.toggleDropdown();
      expect(component.isDropdownOpen()).toBe(true);

      component.toggleDropdown();
      expect(component.isDropdownOpen()).toBe(false);
    });

    it('should close dropdown explicitly', () => {
      component.isDropdownOpen.set(true);

      component.closeDropdown();

      expect(component.isDropdownOpen()).toBe(false);
    });
  });

  describe('Logout Flow', () => {
    it('should show logout confirmation modal', () => {
      component.onLogout();

      expect(component.showLogoutConfirm()).toBe(true);
    });

    it('should close dropdown when showing logout confirm', () => {
      component.isDropdownOpen.set(true);

      component.onLogout();

      expect(component.isDropdownOpen()).toBe(false);
      expect(component.showLogoutConfirm()).toBe(true);
    });

    it('should cancel logout and hide confirmation', () => {
      component.onLogout();
      expect(component.showLogoutConfirm()).toBe(true);

      component.cancelLogout();
      expect(component.showLogoutConfirm()).toBe(false);
    });

    it('should call auth service logout on confirm', () => {
      component.onLogout();
      component.confirmLogout();

      expect(mockAuth.logout).toHaveBeenCalled();
    });

    it('should set isLoggingOut during logout and reset after completion', async () => {
      component.onLogout();
      component.confirmLogout();

      await fixture.whenStable();

      expect(component.isLoggingOut()).toBe(false);
      expect(component.showLogoutConfirm()).toBe(false);
    });

    it('should set isLoggingOut to true during pending logout', () => {
      const logoutSubject = new Subject<void>();
      mockAuth.logout = vi.fn(() => logoutSubject.asObservable());

      component.onLogout();
      component.confirmLogout();

      expect(component.isLoggingOut()).toBe(true);
      expect(component.showLogoutConfirm()).toBe(true);

      logoutSubject.next();
      logoutSubject.complete();

      expect(component.isLoggingOut()).toBe(false);
      expect(component.showLogoutConfirm()).toBe(false);
    });

    it('should handle full logout flow: open confirm, cancel, reopen, confirm', async () => {
      component.onLogout();
      expect(component.showLogoutConfirm()).toBe(true);

      component.cancelLogout();
      expect(component.showLogoutConfirm()).toBe(false);

      component.onLogout();
      expect(component.showLogoutConfirm()).toBe(true);

      component.confirmLogout();
      await fixture.whenStable();

      expect(mockAuth.logout).toHaveBeenCalledTimes(1);
      expect(component.showLogoutConfirm()).toBe(false);
    });
  });

  describe('Role-Based Navigation', () => {
    it('should switch from CONSUMER to SUPPORT and add storybook', () => {
      let storybookItem = component
        .items()
        .find((item) => item.route?.includes('storybook'));
      expect(storybookItem).toBeFalsy();

      store.overrideSelector(userInfoFeature.selectRole, 'SUPPORT');
      store.refreshState();
      fixture.detectChanges();

      (component as any).updateItems();

      storybookItem = component
        .items()
        .find((item) => item.route?.includes('storybook'));
      expect(storybookItem).toBeTruthy();
    });

    it('should not add storybook item twice for SUPPORT role', () => {
      store.overrideSelector(userInfoFeature.selectRole, 'SUPPORT');
      store.refreshState();
      fixture.detectChanges();

      (component as any).updateItems();
      (component as any).updateItems();

      const storybookItems = component
        .items()
        .filter((item) => item.route?.includes('storybook'));
      expect(storybookItems.length).toBe(1);
    });
  });
});

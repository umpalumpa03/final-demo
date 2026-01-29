import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { Sidebar } from './sidebar';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'apps/tia-frontend/src/app/core/auth/services/auth.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Sidebar', () => {
  let component: Sidebar;
  let mockTranslate: any;
  let mockAuth: any;
  let langChangeSubject: Subject<any>;

  beforeEach(() => {
    langChangeSubject = new Subject();
    mockTranslate = {
      onLangChange: langChangeSubject.asObservable(),
      instant: vi.fn((key) => key),
      get: vi.fn((key) => of(key)),
    };
    mockAuth = {
      logout: vi.fn(() => of(null)),
    };

    TestBed.configureTestingModule({
      providers: [
        Sidebar,
        { provide: TranslateService, useValue: mockTranslate },
        { provide: AuthService, useValue: mockAuth },
      ],
    });

    component = TestBed.inject(Sidebar);
  });

  it('should initialize and react to lang change', () => {
    const updateSpy = vi.spyOn(component as any, 'updateItems');

    component.ngOnInit();
    expect(updateSpy).toHaveBeenCalledTimes(1);

    langChangeSubject.next({ lang: 'en' });
    expect(updateSpy).toHaveBeenCalledTimes(2);
  });

  it('should toggle collapse and logout signals', () => {
    component.toggleCollapse();
    expect(component.isCollapsed()).toBe(true);

    component.onLogout();
    expect(component.showLogoutConfirm()).toBe(true);

    component.confirmLogout();
    expect(component.showLogoutConfirm()).toBe(false);
    expect(mockAuth.logout).toHaveBeenCalled();
  });
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { Sidebar } from './sidebar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'apps/tia-frontend/src/app/core/auth/services/auth.service';
import { BreakpointService } from '../../../../shared/services/breakpoints/breakpoint.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ElementRef, signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let mockAuth: any;
  let mockBreakpoint: any;
  let langChangeSubject: Subject<any>;

  beforeEach(async () => {
    langChangeSubject = new Subject();
    mockAuth = {
      logout: vi.fn(() => of(null)),
    };

    mockBreakpoint = {
      isMobile: signal(false),
      isTablet: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [Sidebar, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuth },
        { provide: BreakpointService, useValue: mockBreakpoint },
        {
          provide: ElementRef,
          useValue: { nativeElement: document.createElement('div') },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    Object.defineProperty(translate, 'onLangChange', {
      value: langChangeSubject,
    });

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize and react to lang change', () => {
    const updateSpy = vi.spyOn(component as any, 'updateItems');

    langChangeSubject.next({ lang: 'en' });

    expect(updateSpy).toHaveBeenCalledTimes(1);
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

  it('should handle breakpoint changes via effect', () => {
    mockBreakpoint.isMobile.set(true);
    fixture.detectChanges();

    expect(component.isCollapsed()).toBe(false);
    expect(component.isDropdownOpen()).toBe(false);
  });
});

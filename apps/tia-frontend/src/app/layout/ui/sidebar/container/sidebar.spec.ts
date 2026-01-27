import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { SidebarService } from '../services/sidebar.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  const mockSidebarService = {
    signOut: vi.fn(() => of({ success: true })),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        { provide: SidebarService, useValue: mockSidebarService },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have items from SIDEBARDATA', () => {
    expect(component.items).toBeDefined();
  });

  it('should initialize isCollapsed as false', () => {
    expect(component.isCollapsed()).toBe(false);
  });

  it('should toggle isCollapsed to true', () => {
    component.toggleCollapse();
    expect(component.isCollapsed()).toBe(true);
  });

  it('should toggle isCollapsed back to false', () => {
    component.toggleCollapse();
    component.toggleCollapse();
    expect(component.isCollapsed()).toBe(false);
  });

  it('should call signOut on logout', () => {
    component.onLogout();
    expect(mockSidebarService.signOut).toHaveBeenCalled();
  });
});

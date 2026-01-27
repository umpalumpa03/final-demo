import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { environment } from 'apps/tia-frontend/src/environments/environment';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('SidebarService', () => {
  let service: SidebarService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SidebarService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: { navigate: vi.fn() },
        },
      ],
    });

    service = TestBed.inject(SidebarService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call logout endpoint', () => {
    service.signOut().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({ success: true });
  });

  it('should return success response', () => {
    service.signOut().subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    req.flush({ success: true });
  });

  it('should navigate to login on success', () => {
    service.signOut().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    req.flush({ success: true });

    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});

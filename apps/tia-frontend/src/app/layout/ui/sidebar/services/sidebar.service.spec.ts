import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Sidebar', () => {
  let service: SidebarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SidebarService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    service = TestBed.inject(SidebarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call signOut', () => {
    service.signOut().subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('/auth/logout'));
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });
});

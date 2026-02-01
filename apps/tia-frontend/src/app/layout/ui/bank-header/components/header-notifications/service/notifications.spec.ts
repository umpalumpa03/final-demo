import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Notifications } from './notifications';
import { environment } from '../../../../../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Notifications', () => {
  let service: Notifications;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Notifications,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(Notifications);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hasUnreadNotification', () => {
    it('should call hasUnreadNotification endpoint', () => {
      service.hasUnreadNotification().subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/notifications/has-unread`,
      );
      expect(req.request.method).toBe('GET');
      req.flush({ hasUnread: true });
    });
  });

  describe('getNotifications', () => {
    it('should call getNotifications with default limit', () => {
      service.getNotifications().subscribe();

      const req = httpMock.expectOne(
        (r) =>
          r.url === `${environment.apiUrl}/notifications` &&
          r.params.get('page[limit]') === '10',
      );
      expect(req.request.method).toBe('GET');
      req.flush({ data: [], meta: {} });
    });

    it('should call getNotifications with custom limit', () => {
      service.getNotifications(undefined, 25).subscribe();

      const req = httpMock.expectOne(
        (r) =>
          r.url === `${environment.apiUrl}/notifications` &&
          r.params.get('page[limit]') === '25',
      );
      expect(req.request.method).toBe('GET');
      req.flush({ data: [], meta: {} });
    });

    it('should include cursor when provided', () => {
      service.getNotifications('abc123', 10).subscribe();

      const req = httpMock.expectOne(
        (r) =>
          r.url === `${environment.apiUrl}/notifications` &&
          r.params.get('page[cursor]') === 'abc123',
      );
      expect(req.request.method).toBe('GET');
      req.flush({ data: [], meta: {} });
    });

    it('should not include cursor when undefined', () => {
      service.getNotifications().subscribe();

      const req = httpMock.expectOne(
        (r) => r.url === `${environment.apiUrl}/notifications`,
      );
      expect(req.request.params.has('page[cursor]')).toBe(false);
      req.flush({ data: [], meta: {} });
    });
  });

  describe('removeNotification', () => {
    it('should call DELETE with correct id', () => {
      service.removeNotification('123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/notifications/123`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('markAllAsRead', () => {
    it('should call PATCH to read-all endpoint', () => {
      service.markAllAsRead().subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/notifications/read-all`,
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush({});
    });
  });

  describe('markNotificationRead', () => {
    it('should call PATCH with correct id', () => {
      service.markNotificationRead('456').subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/notifications/456/read`,
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush({});
    });
  });
});

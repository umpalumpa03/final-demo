import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Notifications } from './notifications';
import { environment } from '../../../../../environments/environment';

describe('NotificationsService', () => {
  let service: Notifications;
  let httpMock: HttpTestingController;
  let store: { [key: string]: string };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Notifications],
    });

    service = TestBed.inject(Notifications);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage without spyOn
    store = { 'JWT-Token': 'mock-jwt-token' };
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('userSignIn', () => {
    it('should send POST request with credentials', () => {
      const mockResponse = { token: 'abc123' };

      service.userSignIn().subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('https://tia.up.railway.app/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        username: 'JOHNDOE',
        password: 'pass123123',
      });

      req.flush(mockResponse);
    });
  });

  describe('mfaVerification', () => {
    it('should send POST request with MFA object', () => {
      const mfaObject = { code: '123456', sessionId: 'session-123' };
      const mockResponse = { success: true };

      service.mfaVerification(mfaObject).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        'https://tia.up.railway.app/auth/mfa/verify',
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mfaObject);

      req.flush(mockResponse);
    });
  });

  describe('hasUnreadNotification', () => {
    it('should send GET request with authorization header', () => {
      const mockResponse = { hasUnread: true };

      service.hasUnreadNotification().subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/notifications/has-unread`,
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer mock-jwt-token',
      );

      req.flush(mockResponse);
    });
  });

  describe('getNotifications', () => {
    it('should send GET request with default limit', () => {
      const mockResponse = { data: [], meta: {} };

      service.getNotifications().subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        (request) =>
          request.url === `${environment.apiUrl}/notifications` &&
          request.params.get('page[limit]') === '10',
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer mock-jwt-token',
      );

      req.flush(mockResponse);
    });

    it('should send GET request with custom limit', () => {
      const mockResponse = { data: [], meta: {} };

      service.getNotifications(undefined, 20).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        (request) =>
          request.url === `${environment.apiUrl}/notifications` &&
          request.params.get('page[limit]') === '20',
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });

    it('should send GET request with cursor when provided', () => {
      const mockResponse = { data: [], meta: {} };
      const cursor = 'cursor-abc-123';

      service.getNotifications(cursor, 10).subscribe((response: any) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        (request) =>
          request.url === `${environment.apiUrl}/notifications` &&
          request.params.get('page[limit]') === '10' &&
          request.params.get('page[cursor]') === cursor,
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });

    it('should not include cursor param when cursor is undefined', () => {
      const mockResponse = { data: [], meta: {} };

      service.getNotifications(undefined, 10).subscribe();

      const req = httpMock.expectOne(
        (request) => request.url === `${environment.apiUrl}/notifications`,
      );
      expect(req.request.params.has('page[cursor]')).toBe(false);

      req.flush(mockResponse);
    });
  });
});

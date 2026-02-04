import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import { MessagingService } from './messaging-api.service';

describe('MessagingService', () => {
  let service: MessagingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessagingService]
    });

    service = TestBed.inject(MessagingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getInbox without cursor', () => {
    const mockResponse = { mails: [], cursor: null };

    service.getInbox('inbox', 10).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/mails?type=inbox&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call getInbox with cursor', () => {
    const mockResponse = { mails: [], cursor: 'abc123' };

    service.getInbox('inbox', 10, 'abc123').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/mails?type=inbox&limit=10&cursor=abc123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call markAsRead', () => {
    service.markAsRead(123).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/mails/123/read`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('should call sendEmail', () => {
    const emailData = {
      recipient: 'test@test.com',
      ccRecipients: ['cc@test.com'],
      subject: 'Test Subject',
      body: 'Test Body',
      isImportant: true,
      isDraft: false
    };

    service.sendEmail(emailData).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/mails`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(emailData);
    req.flush(null);
  });

  it('should call deleteMail', () => {
    service.deleteMail(123).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/mails/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should call searchByEmail', () => {
    const mockUsers = [
      { id: '1', email: 'user1@test.com', username: 'user1', firstName: 'User', lastName: 'One' },
      { id: '2', email: 'user2@test.com', username: 'user2', firstName: 'User', lastName: 'Two' }
    ];

    service.searchByEmail('user').subscribe(response => {
      expect(response).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/search-by-email?email=user`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should call getEmailById', () => {
    const mockEmailDetail = {
      id: 1,
      subject: 'Test Email',
      body: 'Test Body',
      senderEmail: 'sender@test.com',
      recipient: 'receiver@test.com',
      createdAt: '2024-01-01T00:00:00.000Z',
      isRead: false,
      isImportant: true
    };

    service.getEmailById(1).subscribe(response => {
      expect(response).toEqual(mockEmailDetail);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/mails/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmailDetail);
  });

  it('should call getDraftTotalCount', () => {
    const mockResponse = { count: 5 };

    service.getDraftTotalCount().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/mails/drafts/total`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call getImportantUnreadCount', () => {
    const mockResponse = { count: 3 };

    service.getImportantUnreadCount().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
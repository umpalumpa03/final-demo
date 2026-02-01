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
});
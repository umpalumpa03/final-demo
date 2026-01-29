import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InboxService } from './inbox.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../environments/environment';

describe('InboxService', () => {
  let service: InboxService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InboxService]
    });

    service = TestBed.inject(InboxService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial inbox count as 0', () => {
    expect(service.inboxCount()).toBe(0);
  });

  it('should fetch and update inbox count', () => {
    const mockResponse = { count: 5 };

    service.fetchInboxCount();

    const req = httpMock.expectOne(`${environment.apiUrl}/mails/unread/count`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.inboxCount()).toBe(5);
  });
});
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { InboxService } from './inbox.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('InboxService', () => {
  let service: InboxService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InboxService],
    });

    service = TestBed.inject(InboxService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch inbox count from the correct API endpoint', () => {
    const mockResponse = { count: 10 };

    service.getInboxCount().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/mails/unread/count'),
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});

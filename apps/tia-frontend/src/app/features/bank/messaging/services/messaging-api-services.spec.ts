import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MessagingService } from './messaging-api-service';
import { environment } from '../../../../../environments/environment.prod';
import { MailsResponse } from '../store/messaging.state';

describe('MessagingService', () => {
  let service: MessagingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        MessagingService,
      ],
    });
    service = TestBed.inject(MessagingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call getInbox with correct params and return data', () => {
    const mockResponse: MailsResponse = {
      items: [],
      pagination: { hasNextPage: false, nextCursor: null }
    };
    const type = 'inbox';
    const limit = 10;
    const cursor = 'abc123';

    service.getInbox(type, limit, cursor).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      r =>
        r.method === 'GET' &&
        r.url === `${environment.apiUrl}/mails` &&
        r.params.get('type') === type &&
        r.params.get('limit') === limit.toString() &&
        r.params.get('cursor') === cursor
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
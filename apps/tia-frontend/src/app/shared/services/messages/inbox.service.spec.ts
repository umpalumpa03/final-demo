import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InboxService } from './inbox.service';
import { environment } from '../../../../environments/environment';

describe('InboxService', () => {
  let service: InboxService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/mails/unread/count`;

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have inboxCount signal initialized to 0', () => {
    expect(service.inboxCount()).toBe(0);
  });

  it('should fetch inbox count and update signal', () => {
    service.fetchInboxCount();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ count: 42 });

    expect(service.inboxCount()).toBe(42);
  });
});
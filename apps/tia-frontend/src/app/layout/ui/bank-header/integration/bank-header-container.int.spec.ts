import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BankHeaderContainer } from '../container/bank-header-container';
import { NotificationsStore } from '../components/header-notifications/store/notifications.store';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectSavedAvatarUrl } from '../../../../features/bank/settings/components/profile-photo/store/profile-photo/profile-photo.selectors';
import {
  selectIsTodayBirthday,
  selectUserFullName,
} from '../../../../store/user-info/user-info.selectors';
import { environment } from '../../../../../environments/environment';
import { ElementRef } from '@angular/core';

beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(private callback: IntersectionObserverCallback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [] as number[];
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as any;
});

describe('BankHeaderContainer Integration', () => {
  let component: BankHeaderContainer;
  let fixture: ComponentFixture<BankHeaderContainer>;
  let httpMock: HttpTestingController;
  let store: MockStore;
  let notificationsStore: InstanceType<typeof NotificationsStore>;

  const NOTIFICATIONS_URL = `${environment.apiUrl}/notifications`;
  const INBOX_URL = `${environment.apiUrl}/mails/unread/count`;

  function drainPendingRequests() {
    httpMock
      .match(() => true)
      .forEach((req) => {
        if (req.request.url.includes('unread-count')) {
          req.flush({ count: 0 });
        } else if (req.request.url.includes('has-unread')) {
          req.flush({ hasUnread: false });
        } else if (req.request.url.includes('mails/unread/count')) {
          req.flush({ count: 0 });
        } else if (req.request.url.includes('remove-all')) {
          req.flush({ success: true });
        } else if (req.request.method === 'DELETE') {
          req.flush({ success: true });
        } else {
          req.flush({ items: [], pageInfo: { hasNext: false } });
        }
      });
  }

  async function stabilize() {
    fixture.detectChanges();
    await fixture.whenStable();
    drainPendingRequests();
    fixture.detectChanges();
    await fixture.whenStable();
    drainPendingRequests();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankHeaderContainer, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({
          selectors: [
            {
              selector: selectSavedAvatarUrl,
              value: 'https://avatar.url/photo.png',
            },
            { selector: selectUserFullName, value: 'John Doe' },
            { selector: selectIsTodayBirthday, value: false },
          ],
        }),
        NotificationsStore,
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BankHeaderContainer);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    notificationsStore = TestBed.inject(NotificationsStore);
  });

  afterEach(() => {
    drainPendingRequests();
    httpMock.verify();
  });

  it('should fetch unread notifications and inbox count on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const hasUnreadReq = httpMock.expectOne(`${NOTIFICATIONS_URL}/has-unread`);
    expect(hasUnreadReq.request.method).toBe('GET');
    hasUnreadReq.flush({ hasUnread: true });

    const inboxReq = httpMock.expectOne(INBOX_URL);
    expect(inboxReq.request.method).toBe('GET');
    inboxReq.flush({ count: 5 });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.hasUnread()).toBe(true);
    expect(component.inboxCount()).toBe(5);
  });

  it('should expose user data from store selectors', async () => {
    await stabilize();

    expect(component.avatarUrl()).toBe('https://avatar.url/photo.png');
    expect(component.fullName()).toBe('John Doe');
    expect(component.hasBirthday()).toBe(false);
  });

  it('should update when store selectors change', async () => {
    await stabilize();

    store.overrideSelector(selectUserFullName, 'Jane Smith');
    store.overrideSelector(selectIsTodayBirthday, true);
    store.refreshState();

    fixture.detectChanges();

    expect(component.fullName()).toBe('Jane Smith');
    expect(component.hasBirthday()).toBe(true);
  });

  describe('Notification Modal', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      httpMock
        .match(() => true)
        .forEach((req) => {
          if (req.request.url.includes('has-unread')) {
            req.flush({ hasUnread: true });
          } else if (req.request.url.includes('mails/unread/count')) {
            req.flush({ count: 3 });
          } else {
            req.flush({ items: [], pageInfo: { hasNext: false } });
          }
        });

      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should open modal and fetch notifications on notification click', async () => {
      const mockEl = new ElementRef(document.createElement('div'));

      component.onNotificationClick(mockEl);
      await fixture.whenStable();

      expect(component.isModalOpen()).toBe(true);
      expect(component.anchorEl()).toBe(mockEl);

      const fetchReq = httpMock.expectOne(
        (req) => req.url === NOTIFICATIONS_URL && req.method === 'GET',
      );
      expect(fetchReq.request.method).toBe('GET');
      fetchReq.flush({
        items: [
          { id: '1', title: 'Notification 1', isRead: false },
          { id: '2', title: 'Notification 2', isRead: true },
        ],
        pageInfo: { hasNext: false },
      });

      await stabilize();

      expect(notificationsStore.items().length).toBe(2);
    });

    it('should close modal when clicking notification while modal is open', async () => {
      const mockEl = new ElementRef(document.createElement('div'));

      component.onNotificationClick(mockEl);
      await fixture.whenStable();
      drainPendingRequests();

      expect(component.isModalOpen()).toBe(true);

      component.onNotificationClick(mockEl);

      expect(component.isModalOpen()).toBe(false);
    });

    it('should close modal via closeAndReset', async () => {
      const mockEl = new ElementRef(document.createElement('div'));

      component.onNotificationClick(mockEl);
      await fixture.whenStable();
      drainPendingRequests();

      expect(component.isModalOpen()).toBe(true);

      component.closeAndReset();

      expect(component.isModalOpen()).toBe(false);
    });
  });

  describe('Inbox Count', () => {
    it('should reflect real inbox count from HTTP response', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const pendingRequests = httpMock.match(() => true);
      pendingRequests.forEach((req) => {
        if (req.request.url.includes('mails/unread/count')) {
          req.flush({ count: 42 });
        } else if (req.request.url.includes('has-unread')) {
          req.flush({ hasUnread: false });
        } else {
          req.flush({ items: [], pageInfo: { hasNext: false } });
        }
      });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.inboxCount()).toBe(42);
    });

    it('should return zero when no unread messages', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const pendingRequests = httpMock.match(() => true);
      pendingRequests.forEach((req) => {
        if (req.request.url.includes('mails/unread/count')) {
          req.flush({ count: 0 });
        } else if (req.request.url.includes('has-unread')) {
          req.flush({ hasUnread: false });
        } else {
          req.flush({ items: [], pageInfo: { hasNext: false } });
        }
      });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.inboxCount()).toBe(0);
    });
  });

  describe('Unread Notifications', () => {
    it('should set hasUnread to true when API reports unread', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const pendingRequests = httpMock.match(() => true);
      pendingRequests.forEach((req) => {
        if (req.request.url.includes('has-unread')) {
          req.flush({ hasUnread: true });
        } else if (req.request.url.includes('mails/unread/count')) {
          req.flush({ count: 0 });
        } else {
          req.flush({ items: [], pageInfo: { hasNext: false } });
        }
      });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.hasUnread()).toBe(true);
    });

    it('should set hasUnread to false when no unread notifications', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const pendingRequests = httpMock.match(() => true);
      pendingRequests.forEach((req) => {
        if (req.request.url.includes('has-unread')) {
          req.flush({ hasUnread: false });
        } else if (req.request.url.includes('mails/unread/count')) {
          req.flush({ count: 0 });
        } else {
          req.flush({ items: [], pageInfo: { hasNext: false } });
        }
      });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.hasUnread()).toBe(false);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { NotificationsContainer } from './notifications-container';
import { NotificationsStore } from '../store/notifications.store';
import { ElementRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../../environments/environment';

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

describe('NotificationsContainer Integration', () => {
  let component: NotificationsContainer;
  let fixture: ComponentFixture<NotificationsContainer>;
  let httpMock: HttpTestingController;
  let store: InstanceType<typeof NotificationsStore>;

  const API_URL = `${environment.apiUrl}/notifications`;

  function drainPendingRequests() {
    httpMock
      .match(() => true)
      .forEach((req) => {
        if (req.request.url.includes('unread-count')) {
          req.flush({ count: 1 });
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
      imports: [NotificationsContainer, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NotificationsStore,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsContainer);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(NotificationsStore);

    fixture.componentRef.setInput('isModalOpen', true);
    fixture.componentRef.setInput(
      'notificationEl',
      new ElementRef(document.createElement('div')),
    );
  });

  afterEach(() => {
    drainPendingRequests();
    httpMock.verify();
  });

  it('should initialize and fetch all data successfully', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const pendingRequests = httpMock.match((req) =>
      req.url.includes('/notifications'),
    );

    pendingRequests.forEach((testReq) => {
      if (testReq.request.url.includes('unread-count')) {
        testReq.flush({ count: 10 });
      } else {
        testReq.flush({
          items: [{ id: '1', title: 'Test' }],
          pageInfo: { hasNext: false },
        });
      }
    });

    await stabilize();

    expect(component.hasError()).toBe(false);
    expect(store.unreadCount()).toBe(10);
  });

  describe('Delete Operations', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      httpMock
        .match((req) => req.url.includes('/notifications'))
        .forEach((req) => {
          if (req.request.url.includes('unread-count')) {
            req.flush({ count: 1 });
          } else {
            req.flush({ items: [], pageInfo: { hasNext: false } });
          }
        });

      store.fetchNotifications({ limit: 10 });
      await fixture.whenStable();

      httpMock
        .expectOne((req) => req.url === API_URL && req.method === 'GET')
        .flush({
          items: [{ id: 'notif-123', title: 'Delete Me', isRead: false }],
          pageInfo: { hasNext: false },
        });

      await stabilize();
    });

    it('should call delete API and remove item from store', async () => {
      component.handleDeleteNotification('notif-123');
      await fixture.whenStable();

      const deleteReq = httpMock.expectOne(`${API_URL}/notif-123`);
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush({ success: true });

      await stabilize();

      expect(store.items().length).toBe(0);
    });

    it('should handle delete all notifications', async () => {
      component.handleDeleteAllNotification();
      await fixture.whenStable();

      const deleteAllReq = httpMock.expectOne(`${API_URL}/remove-all`);
      expect(deleteAllReq.request.method).toBe('DELETE');
      deleteAllReq.flush({ success: true });

      await stabilize();

      expect(store.items().length).toBe(0);
    });
  });

  describe('Modal Close', () => {
    it('should emit closeModal when handleClose is called', async () => {
      await stabilize();

      const closeSpy = vi.fn();
      component.closeModal.subscribe(closeSpy);

      component.handleClose();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit closeModal each time handleClose is called', async () => {
      await stabilize();

      const closeSpy = vi.fn();
      component.closeModal.subscribe(closeSpy);

      component.handleClose();
      component.handleClose();
      component.handleClose();

      expect(closeSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Read Operations', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      httpMock
        .match((req) => req.url.includes('/notifications'))
        .forEach((req) => {
          if (req.request.url.includes('unread-count')) {
            req.flush({ count: 3 });
          } else {
            req.flush({ items: [], pageInfo: { hasNext: false } });
          }
        });

      store.fetchNotifications({ limit: 10 });
      await fixture.whenStable();

      httpMock
        .expectOne((req) => req.url === API_URL && req.method === 'GET')
        .flush({
          items: [
            { id: 'notif-1', title: 'First', isRead: false },
            { id: 'notif-2', title: 'Second', isRead: false },
            { id: 'notif-3', title: 'Third', isRead: false },
          ],
          pageInfo: { hasNext: false },
        });

      await stabilize();
    });

    it('should call mark all as read API', async () => {
      component.handleMarkAllAsRead();
      await fixture.whenStable();

      const markAllReq = httpMock.expectOne(
        (req) => req.url.includes('mark-all-read') || req.url.includes('read'),
      );
      expect(markAllReq.request.method).toMatch(/PATCH|PUT/);
      markAllReq.flush({ success: true });

      await stabilize();

      expect(store.unreadCount()).toBe(0);
    });

    it('should not fire mark-read request if no items become visible', async () => {
      vi.useFakeTimers();

      vi.advanceTimersByTime(2000);
      vi.useRealTimers();

      fixture.detectChanges();
      await fixture.whenStable();

      httpMock.expectNone(
        (req) =>
          req.url.includes('read') &&
          !req.url.includes('unread-count') &&
          req.method === 'PATCH',
      );

      drainPendingRequests();
    });
  });
});

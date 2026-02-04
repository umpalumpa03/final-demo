import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inbox } from './inbox';
import { MessagingStore } from '../../store/messaging.store';
import { NavigationService } from '../../services/navigation.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Mail } from '../../store/messaging.state';

describe('Inbox', () => {
  let component: Inbox;
  let fixture: ComponentFixture<Inbox>;

  let mockMessagingStore: any;
  let mockNavigationService: any;
  let mockRouter: any;

  const mockMails: Mail[] = [
    {
      id: 1,
      subject: 'Inbox 1',
      body: 'Content 1',
      receiverEmail: 'test1@test.com',
      senderEmail: 'sender@test.com',
      isRead: false,
      isImportant: false,
      isFavorite: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      permission: 0,
    },
    {
      id: 2,
      subject: 'Inbox 2',
      body: 'Content 2',
      receiverEmail: 'test2@test.com',
      senderEmail: 'sender@test.com',
      isRead: false,
      isImportant: false,
      isFavorite: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      permission: 0,
    },
  ];

  beforeEach(async () => {
    mockMessagingStore = {
      mails: signal<Mail[]>([]),
      isLoading: signal(false),
      total: signal({ inbox: 2 }),
      pagination: signal({ hasNextPage: false }),

      loadMails: vi.fn(),
      deleteMail: vi.fn(),
      deleteAllMails: vi.fn(),
      markMailasRead: vi.fn(),
      markAllAsRead: vi.fn(),
      getTotalCount: vi.fn(),
    };

    mockNavigationService = {
      previous: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Inbox, TranslateModule.forRoot()],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Inbox);
    component = fixture.componentInstance;
  });

  it('should create the Inbox component', () => {
    mockNavigationService.previous.mockReturnValue(null);

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load inbox mails on init when previous page is not inbox', () => {
    mockNavigationService.previous.mockReturnValue('/bank/messaging/favorites');

    fixture.detectChanges();

    expect(mockMessagingStore.loadMails).toHaveBeenCalledWith('inbox');
    expect(mockMessagingStore.getTotalCount).toHaveBeenCalledWith('inbox');
  });

  it('should NOT load inbox mails when coming from inbox page', () => {
    mockNavigationService.previous.mockReturnValue('/bank/messaging/inbox');

    fixture.detectChanges();

    expect(mockMessagingStore.loadMails).not.toHaveBeenCalled();
    expect(mockMessagingStore.getTotalCount).not.toHaveBeenCalled();
  });

  it('should handle individual mail selection', () => {
    fixture.detectChanges();

    component.onMailChecked(1, true);
    expect(component.selectedMailIds().has(1)).toBe(true);

    component.onMailChecked(1, false);
    expect(component.selectedMailIds().has(1)).toBe(false);
  });

  it('should delete selected mails and reset selection', () => {
    fixture.detectChanges();

    component.onMailChecked(1, true);
    component.onMailChecked(2, true);

    component.deleteSelectedMails();

    expect(mockMessagingStore.deleteAllMails).toHaveBeenCalledWith([1, 2]);
    expect(component.selectedMailIds().size).toBe(0);
  });

  it('should mark selected mails as read and reset selection', () => {
    fixture.detectChanges();

    component.onMailChecked(1, true);
    component.onMailChecked(2, true);

    component.markSelectedAsRead();

    expect(mockMessagingStore.markAllAsRead).toHaveBeenCalledWith([1, 2]);
    expect(component.selectedMailIds().size).toBe(0);
  });

  it('should navigate to inbox detail and mark mail as read', () => {
    fixture.detectChanges();

    component.goToDetail(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/messaging/inbox',
      1,
    ]);
    expect(mockMessagingStore.markMailasRead).toHaveBeenCalledWith(1);
  });

  it('should load more mails and set loadsMoreMails on scroll when next page exists', () => {
    mockMessagingStore.pagination.set({ hasNextPage: true });
    fixture.detectChanges();

    component.onScrollBottom();

    expect(component.loadsMoreMails()).toBe(true);
    expect(mockMessagingStore.loadMails).toHaveBeenCalledWith('inbox');
  });
});

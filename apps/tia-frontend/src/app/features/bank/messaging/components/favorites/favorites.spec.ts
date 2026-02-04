import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Favorites } from './favorites';
import { MessagingStore } from '../../store/messaging.store';
import { NavigationService } from '../../services/navigation.service';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Mail } from '../../store/messaging.state';
import { Router } from '@angular/router';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;

  let mockMessagingStore: any;
  let mockNavigationService: any;
  let mockRouter: any;

  const mockMails: Mail[] = [
    {
      id: 1,
      subject: 'Favorite 1',
      body: 'Content 1',
      receiverEmail: 'test1@test.com',
      senderEmail: 'sender@test.com',
      isRead: false,
      isImportant: false,
      isFavorite: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      permission: 0,
    },
    {
      id: 2,
      subject: 'Favorite 2',
      body: 'Content 2',
      receiverEmail: 'test2@test.com',
      senderEmail: 'sender@test.com',
      isRead: false,
      isImportant: false,
      isFavorite: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      permission: 0,
    },
  ];

  beforeEach(async () => {
    mockMessagingStore = {
      mails: signal<Mail[]>([]),
      isLoading: signal(false),
      total: signal({ favorite: 2 }),
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
      imports: [Favorites, TranslateModule.forRoot()],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
  });

  it('should create the Favorites component', () => {
    mockNavigationService.previous.mockReturnValue(null);

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load favorites on init when previous page is not favorites', () => {
    mockNavigationService.previous.mockReturnValue('/bank/messaging/inbox');

    fixture.detectChanges();

    expect(mockMessagingStore.loadMails).toHaveBeenCalledWith('favorites');
    expect(mockMessagingStore.getTotalCount).toHaveBeenCalledWith('favorite');
  });

  it('should NOT load favorites when coming from favorites page', () => {
    mockNavigationService.previous.mockReturnValue('/bank/messaging/favorites');

    fixture.detectChanges();

    expect(mockMessagingStore.loadMails).not.toHaveBeenCalled();
    expect(mockMessagingStore.getTotalCount).toHaveBeenCalledWith('favorite');
  });

  it('should handle select all logic', () => {
    mockMessagingStore.mails.set(mockMails);
    fixture.detectChanges();

    expect(component.isAllSelected()).toBe(false);

    component.toggleSelectAll(true);
    expect(component.isAllSelected()).toBe(true);
    expect(component.selectedMailIds()).toEqual(new Set([1, 2]));

    component.toggleSelectAll(false);
    expect(component.selectedMailIds()).toEqual(new Set());
  });

  it('should mark selected mails as read and reset selection', () => {
    fixture.detectChanges();

    component.onMailChecked(1, true);
    component.onMailChecked(2, true);

    component.markSelectedAsRead();

    expect(mockMessagingStore.markAllAsRead).toHaveBeenCalledWith([1, 2]);
    expect(component.selectedMailIds().size).toBe(0);
  });

  it('should navigate to favorites detail and mark mail as read', () => {
    fixture.detectChanges();

    component.goToDetail(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/messaging/favorites',
      1,
    ]);
    expect(mockMessagingStore.markMailasRead).toHaveBeenCalledWith(1);
  });

  it('should load more mails on scroll when next page exists', () => {
    mockMessagingStore.pagination.set({ hasNextPage: true });
    fixture.detectChanges();

    component.onScrollBottom();

    expect(mockMessagingStore.loadMails).toHaveBeenCalledWith('favorites');
  });
});

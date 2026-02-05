import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sent } from './sent';
import { MessagingStore } from '../../store/messaging.store';
import { NavigationService } from '../../services/navigation.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Mail } from '../../store/messaging.state';
import { Store } from '@ngrx/store';

describe('Sent', () => {
  let component: Sent;
  let fixture: ComponentFixture<Sent>;

  let mockMessagingStore: any;
  let mockNavigationService: any;
  let mockRouter: any;
  let mockStore: any;

  const mockMails: Mail[] = [
    {
      id: 1,
      subject: 'Sent mail',
      body: 'Body',
      receiverEmail: 'test@test.com',
      senderEmail: 'me@test.com',
      isRead: true,
      isImportant: false,
      isFavorite: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      permission: 0,
    },
  ];

  beforeEach(async () => {
    mockMessagingStore = {
      mails: signal<Mail[]>(mockMails),
      isLoading: signal(false),
      total: signal({ sent: 1 }),
      pagination: signal({ hasNextPage: false }),
      loadMails: vi.fn(),
      getTotalCount: vi.fn(),
    };

    mockNavigationService = {
      previous: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    mockStore = {
      selectSignal: vi.fn().mockReturnValue(signal('test@example.com')),
    };

    await TestBed.configureTestingModule({
      imports: [Sent, TranslateModule.forRoot()],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sent);
    component = fixture.componentInstance;
  });

  it('should create the Sent component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT load sent mails on init when coming from sent page', () => {
    mockNavigationService.previous.mockReturnValue('/bank/messaging/sent');

    fixture.detectChanges();

    expect(mockMessagingStore.loadMails).not.toHaveBeenCalled();
    expect(mockMessagingStore.getTotalCount).not.toHaveBeenCalled();
  });

  it('should navigate to sent mail detail', () => {
    fixture.detectChanges();

    component.goToDetail(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/bank/messaging/sent', 1],
      { queryParams: { sent: true } }
    );
  });

  it('should load more mails on scroll when next page exists', () => {
    mockMessagingStore.pagination.set({ hasNextPage: true });
    mockNavigationService.previous.mockReturnValue('/bank/messaging/inbox');

    fixture.detectChanges();

    component.onScrollBottom();

    expect(component.loadsMoreMails()).toBe(true);
    expect(mockMessagingStore.loadMails).toHaveBeenCalledWith('sent');
  });
});

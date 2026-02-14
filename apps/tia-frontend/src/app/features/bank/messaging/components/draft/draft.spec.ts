import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Draft } from './draft';
import { MessagingStore } from '../../store/messaging.store';
import { NavigationService } from '../../services/navigation.service';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Mail } from '../../store/messaging.state';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

describe('Draft', () => {
  let component: Draft;
  let fixture: ComponentFixture<Draft>;

  let mockMessagingStore: any;
  let mockNavigationService: any;
  let mockRouter: any;
  let mockStore: any;

  const mockMails: Mail[] = [
    {
      id: 1,
      subject: 'Draft 1',
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
      subject: 'Draft 2',
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
      error: signal(null),
      draftsTotal: signal(0),
      pagination: signal({ hasNextPage: false }),

      loadMails: vi.fn(),
      deleteMail: vi.fn(),
      deleteAllMails: vi.fn(),
      getDraftTotalCount: vi.fn(),
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
      imports: [Draft, TranslateModule.forRoot()],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Draft);
    component = fixture.componentInstance;
  });

  it('should create the Draft component', () => {
    mockNavigationService.previous.mockReturnValue(null);

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load drafts on init when previous page is not draft', () => {
    mockNavigationService.previous.mockReturnValue('/bank/messaging/inbox');

    fixture.detectChanges();

    expect(mockMessagingStore.loadMails).toHaveBeenCalledWith('drafts');
    expect(mockMessagingStore.getDraftTotalCount).toHaveBeenCalledWith(0);
  });

  it('should NOT load drafts on init when coming from draft page with existing mails', () => {
    mockNavigationService.previous.mockReturnValue('/bank/messaging/draft');
    mockMessagingStore.mails.set([{ id: 1 }, { id: 2 }]); 

    fixture.detectChanges();

    expect(mockMessagingStore.loadMails).not.toHaveBeenCalled();
    expect(mockMessagingStore.getDraftTotalCount).not.toHaveBeenCalled();
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

  it('should navigate to draft detail page', () => {
    fixture.detectChanges();

    component.goToDetail(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/messaging/draft',
      1,
    ]);
  });

  it('should load more mails on scroll when next page exists', () => {
    mockMessagingStore.pagination.set({ hasNextPage: true });
    fixture.detectChanges();

    component.onScrollBottom();

    expect(component.loadsMoreMails()).toBe(true);
    expect(mockMessagingStore.loadMails).toHaveBeenCalledWith('drafts');
  });

});

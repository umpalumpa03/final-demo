import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inbox } from './inbox';
import { MessagingStore } from '../../store/messaging.store';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Mail } from '../../store/messaging.state';

describe('Inbox', () => {
  let component: Inbox;
  let fixture: ComponentFixture<Inbox>;
  let mockMessagingStore: any;

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
      permission: 0
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
      permission: 0
    },
  ];

  beforeEach(async () => {
    mockMessagingStore = {
      mails: signal<Mail[]>([]),
      isLoading: signal(false),
      error: signal<string | null>(null),
      loadMails: vi.fn(),
      deleteMail: vi.fn(),
      deleteAllMails: vi.fn(),
      markMailasRead: vi.fn(),
      markAllAsRead: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Inbox, TranslateModule.forRoot()],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Inbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the Inbox component', () => {
    expect(component).toBeTruthy();
  });

  it('should create and initialize on ngOnInit', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(mockMessagingStore.loadMails).toHaveBeenCalledWith('inbox');
  });

  it('should handle select all and isAllSelected', () => {
    mockMessagingStore.mails.set(mockMails);

    expect(component.isAllSelected()).toBe(false);
    component.toggleSelectAll(true);
    expect(component.isAllSelected()).toBe(true);
    expect(component.selectedMailIds()).toEqual(new Set([1, 2]));

    component.toggleSelectAll(false);
    expect(component.selectedMailIds()).toEqual(new Set());
  });

  it('should handle individual mail selection', () => {
    component.onMailChecked(1, true);
    expect(component.selectedMailIds().has(1)).toBe(true);

    component.onMailChecked(1, false);
    expect(component.selectedMailIds().has(1)).toBe(false);
  });

  it('should handle bulk deletion', () => {
    component.selectedMailIds.set(new Set([1, 2]));
    component.deleteSelectedMails();
    expect(mockMessagingStore.deleteAllMails).toHaveBeenCalledWith([1, 2]);
    expect(component.selectedMailIds()).toEqual(new Set());
  });

  it('should navigate to inbox detail', () => {
    const mockRouter = {
      navigate: vi.fn()
    };
    (component as any).router = mockRouter;
    component.goToDetail(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/messaging/inbox', 1]);
  });
});
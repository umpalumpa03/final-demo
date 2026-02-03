import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Draft } from './draft';
import { MessagingStore } from '../../store/messaging.store';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Mail } from '../../store/messaging.state';

describe('Draft', () => {
  let component: Draft;
  let fixture: ComponentFixture<Draft>;
  let mockMessagingStore: any;

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
      permission: 0
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
    };

    await TestBed.configureTestingModule({
      imports: [Draft, TranslateModule.forRoot()],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Draft);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the Draft component', () => {
    expect(component).toBeTruthy();
  });

  it('should create and initialize on ngOnInit', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(mockMessagingStore.loadMails).toHaveBeenCalledWith('drafts');
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

  it('should navigate to draft detail', () => {
    const mockRouter = {
      navigate: vi.fn()
    };
    (component as any).router = mockRouter;
    component.goToDetail(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/messaging/draft', 1]);
  });

});
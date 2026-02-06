import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InboxDetail } from './inbox-detail';
import { MessagingStore } from '../../store/messaging.store';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Mail } from '../../store/messaging.state';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

describe('InboxDetail', () => {
  let component: InboxDetail;
  let fixture: ComponentFixture<InboxDetail>;

  let mockMessagingStore: any;
  let mockRouter: any;
  let mockStore: any;

  const mockMail: Mail = {
    id: 1,
    subject: 'Test mail',
    body: 'Body',
    receiverEmail: 'test@test.com',
    senderEmail: 'sender@test.com',
    isRead: true,
    isImportant: false,
    isFavorite: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    permission: 0,
  };

  beforeEach(async () => {
    mockMessagingStore = {
      emailDetail: signal<Mail | null>(mockMail),
      mailReplies: signal([]),
      getEmailById: vi.fn(),
      getMailReplies: vi.fn(), 
      deleteMail: vi.fn(),
      togleFavorite: vi.fn(),
      isLoading: signal(false),
      isFavoriteLoading: signal(false),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    mockStore = {
      selectSignal: vi.fn().mockReturnValue(signal('test@example.com')),
    };

    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('1'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [InboxDetail, TranslateModule.forRoot()],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InboxDetail);
    component = fixture.componentInstance;
  });

  it('should create the InboxDetail component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load email detail and replies on init', () => {
    fixture.detectChanges();

    expect(mockMessagingStore.getEmailById).toHaveBeenCalledWith(1);
    expect(mockMessagingStore.getMailReplies).toHaveBeenCalledWith(1); 
  });

  it('should toggle favorite status', () => {
    fixture.detectChanges();

    component.toggleFavorite();

    expect(mockMessagingStore.togleFavorite).toHaveBeenCalledWith({
      mailId: 1,
      isFavorite: true,
    });
  });

  it('should open delete modal on delete click', () => {
    fixture.detectChanges();

    const event = { stopPropagation: vi.fn() } as any;
    component.onDelete(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.isDeleteModalOpen()).toBe(true);
  });

  it('should confirm delete and navigate back', () => {
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.deleteMail, 'emit');

    component.isDeleteModalOpen.set(true);
    component.onConfirmDelete();

    expect(emitSpy).toHaveBeenCalledWith(1);
    expect(mockMessagingStore.deleteMail).toHaveBeenCalledWith(1);
    expect(component.isDeleteModalOpen()).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['..'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
  });
});

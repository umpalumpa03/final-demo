import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SentDraftDetail } from './sent-draft-detail';
import { MessagingStore } from '../../store/messaging.store';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Mail } from '../../store/messaging.state';

describe('SentDraftDetail', () => {
  let component: SentDraftDetail;
  let fixture: ComponentFixture<SentDraftDetail>;

  let mockMessagingStore: any;
  let mockRouter: any;

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
      getEmailById: vi.fn(),
      deleteMail: vi.fn(),
      sendDraft: vi.fn(),
      isLoading: signal(false),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('1'),
        },
        queryParamMap: {
          get: vi.fn().mockReturnValue(null),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [SentDraftDetail],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SentDraftDetail);
    component = fixture.componentInstance;
  });

  it('should create the SentDraftDetail component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load email detail on init', () => {
    fixture.detectChanges();

    expect(mockMessagingStore.getEmailById).toHaveBeenCalledWith(1);
  });

  it('should detect fromSent query param as false when not provided', () => {
    fixture.detectChanges();

    expect(component.fromSent).toBe(false);
  });

  it('should detect fromSent query param as true when provided', async () => {
    const mockActivatedRouteWithSent = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('1'),
        },
        queryParamMap: {
          get: vi.fn().mockReturnValue('true'),
        },
      },
    };

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SentDraftDetail],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore },
        { provide: ActivatedRoute, useValue: mockActivatedRouteWithSent },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const newFixture = TestBed.createComponent(SentDraftDetail);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.fromSent).toBe(true);
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

  it('should not delete when email detail is null', () => {
    mockMessagingStore.emailDetail.set(null);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.deleteMail, 'emit');

    component.onConfirmDelete();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(mockMessagingStore.deleteMail).not.toHaveBeenCalled();
  });

  it('should cancel delete and close modal', () => {
    fixture.detectChanges();

    component.isDeleteModalOpen.set(true);
    component.onCancelDelete();

    expect(component.isDeleteModalOpen()).toBe(false);
  });

  it('should not send draft when email detail is null', () => {
    mockMessagingStore.emailDetail.set(null);
    fixture.detectChanges();

    component.sendDraft();

    expect(mockMessagingStore.sendDraft).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
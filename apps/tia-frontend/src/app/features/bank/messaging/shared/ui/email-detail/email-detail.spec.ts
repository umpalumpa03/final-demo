import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailDetail } from './email-detail';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagingStore } from '../../../store/messaging.store';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmailDetailData } from '../../../store/messaging.state';

describe('EmailDetail', () => {
  let component: EmailDetail;
  let fixture: ComponentFixture<EmailDetail>;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockMessagingStore: any;

  const mockEmailData: EmailDetailData = {
    id: 1,
    subject: 'Test Subject',
    senderEmail: 'sender@test.com',
    recipient: 'receiver@test.com',
    ccRecipients: ['cc1@test.com', 'cc2@test.com'],
    body: 'Test email body',
    createdAt: '2024-01-01T00:00:00.000Z',
    isDraft: false,
    isFavorite: false,
    mailType: 'inbox',
    isRead: true,
    isImportant: false
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn()
    };

    mockActivatedRoute = {
      snapshot: {}
    };

    mockMessagingStore = {
      isLoading: signal(false)
    };

    await TestBed.configureTestingModule({
      imports: [EmailDetail],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MessagingStore, useValue: mockMessagingStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get initials from email', () => {
    const initials = component.getInitials('john@test.com');
    expect(initials).toBe('JO');
  });

  it('should return empty string for undefined email', () => {
    const initials = component.getInitials(undefined);
    expect(initials).toBe('');
  });

  it('should return empty string for empty email', () => {
    const initials = component.getInitials('');
    expect(initials).toBe('');
  });

  it('should navigate back on goBack', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['..'], { relativeTo: mockActivatedRoute });
  });

  it('should display email data', () => {
    fixture.componentRef.setInput('data', mockEmailData);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Subject');
    expect(compiled.textContent).toContain('sender@test.com');
    expect(compiled.textContent).toContain('receiver@test.com');
  });

  it('should display loading state when isLoading is true', () => {
    mockMessagingStore.isLoading.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.skeleton')).toBeTruthy();
  });

  it('should display draft label when isDraft is true', () => {
    const draftEmail = { ...mockEmailData, isDraft: true };
    fixture.componentRef.setInput('data', draftEmail);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Draft:');
  });

  it('should display CC recipients when available', () => {
    fixture.componentRef.setInput('data', mockEmailData);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('CC:');
  });

  it('should expose isLoading from store', () => {
    mockMessagingStore.isLoading.set(true);
    expect(component.isLoading()).toBe(true);

    mockMessagingStore.isLoading.set(false);
    expect(component.isLoading()).toBe(false);
  });
});
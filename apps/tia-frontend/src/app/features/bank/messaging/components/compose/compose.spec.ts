import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Compose } from './compose';
import { MessagingStore } from '../../store/messaging.store';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { User } from '../../store/messaging.state';

describe('Compose', () => {
  let component: Compose;
  let fixture: ComponentFixture<Compose>;
  let mockMessagingStore: any;

  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser'
  };

  beforeEach(async () => {
    mockMessagingStore = {
      searchResults: signal<User[]>([]),
      isSearching: signal(false),
      searchMails: vi.fn(),
      sendEmail: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Compose, TranslateModule.forRoot()],
      providers: [
        { provide: MessagingStore, useValue: mockMessagingStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Compose);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('isOpen', true);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.value).toEqual({
      subject: '',
      body: '',
      isImportant: false
    });
  });

  it('should call searchMails on search query', () => {
    component.onSearchEmails('test');
    expect(mockMessagingStore.searchMails).toHaveBeenCalledWith('test');
  });

  it('should set toEmail when user is selected', () => {
    component.onToEmailSelected(mockUser);
    expect(component.toEmail()).toBe('test@test.com');
  });

  it('should add CC email when user is selected', () => {
    component.onCcEmailSelected(mockUser);
    expect(component.ccEmails()).toEqual(['test@test.com']);
  });

  it('should not add duplicate CC email', () => {
    component.ccEmails.set(['test@test.com']);
    component.onCcEmailSelected(mockUser);
    expect(component.ccEmails()).toEqual(['test@test.com']);
  });

  it('should send email with valid data', () => {
    component.form.patchValue({
      subject: 'Test Subject',
      body: 'Test Body',
      isImportant: true
    });
    component.toEmail.set('test@test.com');
    component.ccEmails.set(['cc@test.com']);

    component.onSendEmail();

    expect(mockMessagingStore.sendEmail).toHaveBeenCalledWith({
      recipient: 'test@test.com',
      ccRecipients: ['cc@test.com'],
      subject: 'Test Subject',
      body: 'Test Body',
      isImportant: true,
      isDraft: false
    });
  });

  it('should save draft with valid data', () => {
    component.form.patchValue({
      subject: 'Test Subject',
      body: 'Test Body'
    });
    component.toEmail.set('test@test.com');

    component.onSaveDraft();

    expect(mockMessagingStore.sendEmail).toHaveBeenCalledWith({
      recipient: 'test@test.com',
      ccRecipients: [],
      subject: 'Test Subject',
      body: 'Test Body',
      isImportant: false,
      isDraft: true
    });
  });

  it('should show error when toEmail is missing', () => {
    component.form.patchValue({
      subject: 'Test Subject',
      body: 'Test Body'
    });

    component.onSendEmail();

    expect(component.invalidForm()).toBe(true);
    expect(component.errorMesage()).toBe('Recipient email is required.');
    expect(mockMessagingStore.sendEmail).not.toHaveBeenCalled();
  });

  it('should show error when form is invalid', () => {
    component.toEmail.set('test@test.com');
    component.form.patchValue({
      subject: '',
      body: ''
    });

    component.onSendEmail();

    expect(component.invalidForm()).toBe(true);
    expect(component.errorMesage()).toBe('Please fill in subject and message.');
    expect(mockMessagingStore.sendEmail).not.toHaveBeenCalled();
  });

  it('should show error when email is invalid', () => {
    component.isInvalidToEmail = true;
    component.form.patchValue({
      subject: 'Test',
      body: 'Test'
    });
    component.toEmail.set('test@test.com');

    component.onSendEmail();

    expect(component.invalidForm()).toBe(true);
    expect(component.errorMesage()).toBe('Please select valid email addresses from the suggestions.');
    expect(mockMessagingStore.sendEmail).not.toHaveBeenCalled();
  });

  it('should reset form on close', () => {
    component.form.patchValue({
      subject: 'Test',
      body: 'Test',
      isImportant: true
    });
    component.toEmail.set('test@test.com');
    component.ccEmails.set(['cc@test.com']);

    component.onClose();

    expect(component.form.value).toEqual({
      subject: '',
      body: '',
      isImportant: false
    });
    expect(component.toEmail()).toBe('');
    expect(component.ccEmails()).toEqual([]);
  });

  it('should set invalid flags for emails', () => {
    component.onInvalidToEmail(true);
    expect(component.isInvalidToEmail).toBe(true);

    component.onInvalidCcEmail(true);
    expect(component.isInvalidCcEmail).toBe(true);
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailChipsInput } from './email-chips-input';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { User } from '../../../store/messaging.state';

describe('EmailChipsInput', () => {
  let component: EmailChipsInput;
  let fixture: ComponentFixture<EmailChipsInput>;

  const mockUsers: User[] = [
    { id: '1', email: 'user1@test.com', firstName: 'User', lastName: 'One', username: 'user1' },
    { id: '2', email: 'user2@test.com', firstName: 'User', lastName: 'Two', username: 'user2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailChipsInput, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailChipsInput);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('placeholder', 'Enter email');
    fixture.componentRef.setInput('searchResults', []);
    fixture.componentRef.setInput('allowMultiple', false);
    
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search query on input', () => {
    const searchQuerySpy = vi.fn();
    component.searchQuery.subscribe(searchQuerySpy);

    const event = { target: { value: 'test@test.com' } } as any;
    component.onSearchInput(event);

    expect(searchQuerySpy).toHaveBeenCalledWith('test@test.com');
    expect(component.showDropdown()).toBe(true);
  });

  it('should select user in single mode', () => {
    const emailSelectedSpy = vi.fn();
    component.emailSelected.subscribe(emailSelectedSpy);
    
    fixture.componentRef.setInput('searchResults', mockUsers);
    
    component.selectUser(mockUsers[0]);

    expect(emailSelectedSpy).toHaveBeenCalledWith(mockUsers[0]);
    expect(component.inputControl.value).toBe('user1@test.com');
    expect(component.showDropdown()).toBe(false);
  });

  it('should add email in multiple mode', () => {
    fixture.componentRef.setInput('allowMultiple', true);
    fixture.componentRef.setInput('searchResults', mockUsers);
    
    component.selectUser(mockUsers[0]);
    component.selectUser(mockUsers[1]);

    expect(component.selectedEmails()).toEqual(['user1@test.com', 'user2@test.com']);
    expect(component.inputControl.value).toBe('');
  });

  it('should remove email from selected emails', () => {
    const emailRemovedSpy = vi.fn();
    component.emailRemoved.subscribe(emailRemovedSpy);
    
    component.selectedEmails.set(['user1@test.com', 'user2@test.com']);
    component.removeEmail('user1@test.com');

    expect(component.selectedEmails()).toEqual(['user2@test.com']);
    expect(emailRemovedSpy).toHaveBeenCalledWith('user1@test.com');
  });

  it('should handle arrow down navigation', () => {
    fixture.componentRef.setInput('searchResults', mockUsers);
    
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    component.onKeyDown(event);

    expect(component.highlightedIndex()).toBe(0);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should handle arrow up navigation', () => {
    fixture.componentRef.setInput('searchResults', mockUsers);
    component.highlightedIndex.set(1);
    
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    component.onKeyDown(event);

    expect(component.highlightedIndex()).toBe(0);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should select highlighted user on Enter', () => {
    fixture.componentRef.setInput('searchResults', mockUsers);
    component.highlightedIndex.set(0);
    
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    component.onKeyDown(event);

    expect(component.inputControl.value).toBe('user1@test.com');
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should close dropdown on Escape', () => {
    component.showDropdown.set(true);
    
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    component.onKeyDown(event);

    expect(component.showDropdown()).toBe(false);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should remove last email on Backspace in multiple mode', () => {
    fixture.componentRef.setInput('allowMultiple', true);
    component.selectedEmails.set(['user1@test.com', 'user2@test.com']);
    component.inputControl.setValue('');
    
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    component.onKeyDown(event);

    expect(component.selectedEmails()).toEqual(['user1@test.com']);
  });

  it('should clear input on Backspace in single mode', () => {
    component.inputControl.setValue('test@test.com');
    
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    component.onKeyDown(event);

    expect(component.inputControl.value).toBe('');
  });

  it('should update highlighted index on mouse enter', () => {
    component.onUserMouseEnter(1);

    expect(component.highlightedIndex()).toBe(1);
  });

  it('should reset component state', () => {
    component.inputControl.setValue('test@test.com');
    component.selectedEmails.set(['user1@test.com']);
    component.showDropdown.set(true);

    component.reset();

    expect(component.inputControl.value).toBe('');
    expect(component.selectedEmails()).toEqual([]);
    expect(component.showDropdown()).toBe(false);
  });

  it('should emit invalid email in single mode', () => {
    const invalidToEmailSpy = vi.fn();
    component.invalidToEmail.subscribe(invalidToEmailSpy);
    
    fixture.componentRef.setInput('searchResults', mockUsers);
    
    const event = { target: { value: 'invalid@test.com' } } as any;
    component.onSearchInput(event);

    expect(invalidToEmailSpy).toHaveBeenCalledWith(true);
  });

  it('should emit invalid email in multiple mode', () => {
    fixture.componentRef.setInput('allowMultiple', true);
    const invalidCcEmailSpy = vi.fn();
    component.invalidCcEmail.subscribe(invalidCcEmailSpy);
    
    fixture.componentRef.setInput('searchResults', mockUsers);
    
    const event = { target: { value: 'invalid@test.com' } } as any;
    component.onSearchInput(event);

    expect(invalidCcEmailSpy).toHaveBeenCalledWith(true);
  });

  it('should not add duplicate email in multiple mode', () => {
    fixture.componentRef.setInput('allowMultiple', true);
    component.selectedEmails.set(['user1@test.com']);
    
    component.selectUser(mockUsers[0]);

    expect(component.selectedEmails()).toEqual(['user1@test.com']);
  });

  it('should clear selected user', () => {
    const emailSelectedSpy = vi.fn();
    component.emailSelected.subscribe(emailSelectedSpy);

    component.clearSelectUser();

    expect(emailSelectedSpy).toHaveBeenCalledWith({} as User);
  });

  it('should emit false for invalid email when query is empty in single mode', () => {
    const invalidToEmailSpy = vi.fn();
    component.invalidToEmail.subscribe(invalidToEmailSpy);

    const event = { target: { value: '' } } as any;
    component.onSearchInput(event);

    expect(invalidToEmailSpy).toHaveBeenCalledWith(false);
    expect(component.showDropdown()).toBe(false);
  });

  it('should emit false for invalid email when query is empty in multiple mode', () => {
    fixture.componentRef.setInput('allowMultiple', true);
    const invalidCcEmailSpy = vi.fn();
    component.invalidCcEmail.subscribe(invalidCcEmailSpy);

    const event = { target: { value: '' } } as any;
    component.onSearchInput(event);

    expect(invalidCcEmailSpy).toHaveBeenCalledWith(false);
    expect(component.showDropdown()).toBe(false);
  });

  it('should wrap navigation from last to first on ArrowDown', () => {
    fixture.componentRef.setInput('searchResults', mockUsers);
    component.highlightedIndex.set(1); 
    
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    component.onKeyDown(event);

    expect(component.highlightedIndex()).toBe(0);
  });

  it('should wrap navigation from first to last on ArrowUp', () => {
    fixture.componentRef.setInput('searchResults', mockUsers);
    component.highlightedIndex.set(0); 
    
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    component.onKeyDown(event);

    expect(component.highlightedIndex()).toBe(1);
  });

  it('should set error when Enter pressed with invalid email', () => {
    fixture.componentRef.setInput('searchResults', mockUsers);
    component.inputControl.setValue('invalid@test.com');
    
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDown(event);

    expect(component.inputControl.errors).toEqual({ notFound: true });
  });

  it('should emit validation outputs on reset', () => {
    const invalidCcEmailSpy = vi.fn();
    const invalidToEmailSpy = vi.fn();
    component.invalidCcEmail.subscribe(invalidCcEmailSpy);
    component.invalidToEmail.subscribe(invalidToEmailSpy);

    component.reset();

    expect(invalidCcEmailSpy).toHaveBeenCalledWith(false);
    expect(invalidToEmailSpy).toHaveBeenCalledWith(false);
  });

  it('should handle onInputBlur with valid email in single mode', async () => {
    fixture.componentRef.setInput('searchResults', mockUsers);
    component.inputControl.setValue('user1@test.com');

    component.onInputBlur();

    await new Promise(resolve => setTimeout(resolve, 250));

    expect(component.inputControl.value).toBe('user1@test.com');
    expect(component.showDropdown()).toBe(false);
  });
});
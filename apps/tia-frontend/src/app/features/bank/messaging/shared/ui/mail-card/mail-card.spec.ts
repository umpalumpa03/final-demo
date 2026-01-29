import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MailCard } from './mail-card';
import { Mail } from '../../../store/messaging.state';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MailCard', () => {
  let component: MailCard;
  let fixture: ComponentFixture<MailCard>;

  const mockMail: Mail = {
    id: 1,
    subject: 'Test Subject',
    senderEmail: 'test@example.com',
    receiverEmail: 'receiver@example.com',
    body: 'Test body',
    isRead: false,
    isImportant: true,
    isFavorite: true,
    createdAt: '2024-01-01T00:00:00Z',
    permission: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailCard]
    }).compileComponents();

    fixture = TestBed.createComponent(MailCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mail', mockMail);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit markAsRead', () => {
    const spy = vi.fn();
    component.markAsRead.subscribe(spy);
    const event = new Event('click');

    component.onMarkAsRead(event);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should emit toggleFavorite', () => {
    const spy = vi.fn();
    component.toggleFavorite.subscribe(spy);
    const event = new Event('click');

    component.onToggleFavorite(event);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should emit toggleImportant', () => {
    const spy = vi.fn();
    component.toggleImportant.subscribe(spy);
    const event = new Event('click');

    component.onToggleImportant(event);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should emit deleteMail', () => {
    const spy = vi.fn();
    component.deleteMail.subscribe(spy);
    const event = new Event('click');

    component.onDelete(event);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should emit cardClick', () => {
    const spy = vi.fn();
    component.cardClick.subscribe(spy);

    component.onCardClick();

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should get initials from email', () => {
    const initials = component.getInitials('test@example.com');
    expect(initials).toBe('TE');
  });

  it('should stop event propagation', () => {
    const event = new Event('click');
    const spy = vi.spyOn(event, 'stopPropagation');

    component.onMarkAsRead(event);

    expect(spy).toHaveBeenCalled();
  });
});
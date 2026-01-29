import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MailCard } from './mail-card';
import { Mail } from '../../../store/messaging.state';

describe('MailCard', () => {
  let component: MailCard;
  let fixture: ComponentFixture<MailCard>;
  const mail: Mail = {
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
      imports: [MailCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MailCard);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'mail', { value: () => mail });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render mail subject, sender, and body', () => {
    const subject = fixture.nativeElement.querySelector('.mail-card__subject');
    const sender = fixture.nativeElement.querySelector('.mail-card__sender');
    const body = fixture.nativeElement.querySelector('.mail-card__preview');
    expect(subject.textContent).toContain(mail.subject);
    expect(sender.textContent).toContain(mail.senderEmail);
    expect(body.textContent).toContain(mail.body);
  });

  // it('should emit toggleRead when read button is clicked', () => {
  //   vi.spyOn(component.toggleRead, 'emit');
  //   const btn = fixture.nativeElement.querySelector('.mail-card__action-btn--read');
  //   btn.dispatchEvent(new Event('click'));
  //   expect(component.toggleRead.emit).toHaveBeenCalledWith(mail.id);
  // });

  it('should emit toggleFavorite when favorite button is clicked', () => {
    vi.spyOn(component.toggleFavorite, 'emit');
    const btn = fixture.nativeElement.querySelector('.mail-card__action-btn--favorite');
    btn.dispatchEvent(new Event('click'));
    expect(component.toggleFavorite.emit).toHaveBeenCalledWith(mail.id);
  });

  it('should emit toggleImportant when important button is clicked', () => {
    vi.spyOn(component.toggleImportant, 'emit');
    const btn = fixture.nativeElement.querySelector('.mail-card__action-btn--important');
    btn.dispatchEvent(new Event('click'));
    expect(component.toggleImportant.emit).toHaveBeenCalledWith(mail.id);
  });

  it('should emit deleteMail when delete button is clicked', () => {
    vi.spyOn(component.deleteMail, 'emit');
    const btn = fixture.nativeElement.querySelector('.mail-card__action-btn--delete');
    btn.dispatchEvent(new Event('click'));
    expect(component.deleteMail.emit).toHaveBeenCalledWith(mail.id);
  });

  it('should emit cardClick when card is clicked', () => {
    vi.spyOn(component.cardClick, 'emit');
    const card = fixture.nativeElement.querySelector('.mail-card');
    card.dispatchEvent(new Event('click'));
    expect(component.cardClick.emit).toHaveBeenCalledWith(mail.id);
  });

  it('should get initials from sender email', () => {
    expect(component.getInitials('test@example.com')).toBe('TE');
  });
});
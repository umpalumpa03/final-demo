import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Mail } from '../../../store/messaging.state';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-mail-card',
  imports: [Avatar, DatePipe],
  templateUrl: './mail-card.html',
  styleUrl: './mail-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailCard {
  public readonly mail = input<Mail>();
  public readonly toggleRead = output<number>();
  public readonly toggleFavorite = output<number>();
  public readonly toggleImportant = output<number>();
  public readonly deleteMail = output<number>();
  public readonly cardClick = output<number>();

  public onToggleRead(event: Event): void {
    event.stopPropagation();
    const mail = this.mail();
    if (mail) this.toggleRead.emit(mail.id);
  }

  public onToggleFavorite(event: Event): void {
    event.stopPropagation();
    const mail = this.mail();
    if (mail) this.toggleFavorite.emit(mail.id);
  }

  public onToggleImportant(event: Event): void {
    event.stopPropagation();
    const mail = this.mail();
    if (mail) this.toggleImportant.emit(mail.id);
  }

  public onDelete(event: Event): void {
    event.stopPropagation();
    const mail = this.mail();
    if (mail) this.deleteMail.emit(mail.id);
  }

  public onCardClick(): void {
    const mail = this.mail();
    if (mail) this.cardClick.emit(mail.id);
  }

  public getInitials(email: string): string {
    return email.substring(0, 2).toUpperCase();
  }
}

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';

@Component({
  selector: 'app-replies-card',
  imports: [Avatar, DatePipe],
  templateUrl: './replies-card.html',
  styleUrl: './replies-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepliesCard {
  public readonly reply = input<{ authorEmail: string; body: string; createdAt: string }>();

  public getInitials(email: string): string {
    return email?.substring(0, 2).toUpperCase();
  }
}

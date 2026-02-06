import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Mail } from '../../../store/messaging.state';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { DatePipe } from '@angular/common';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-mail-card',
  imports: [Avatar, TranslatePipe, DatePipe, UiModal, LibraryTitle, ButtonComponent, Checkboxes],
  templateUrl: './mail-card.html',
  styleUrl: './mail-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailCard {
  public readonly mail = input<Mail>();
  public readonly markAsRead = output<number>();
  public readonly toggleFavorite = output<number>();
  public readonly toggleImportant = output<number>();
  public readonly deleteMail = output<number>();
  public readonly cardClick = output<number>();
  public readonly isSent = input<boolean>(false);
  public readonly isDraft = input<boolean>(false);
  public readonly isDeleteModalOpen = signal(false);
  public readonly checked = input<boolean>(false);
  public readonly checkedChange = output<boolean>();
  private readonly breakpointService = inject(BreakpointService);
  public readonly isExtraSmall = this.breakpointService.isExtraSmall;
  public readonly currentUserEmail = input<string>();

  public readonly isCurrentUser = computed(() => {
    const currentEmail = this.currentUserEmail();
    const mailSenderEmail = this.mail()?.senderEmail;
    return currentEmail && mailSenderEmail && currentEmail === mailSenderEmail;
  });

  public onCheckboxChange(checked: boolean): void {
    this.checkedChange.emit(checked);
  }


  public onMarkAsRead(event: Event): void {
    event.stopPropagation();
    const mail = this.mail();
    if (mail && !mail.isRead) {
      this.markAsRead.emit(mail.id);
    }
  }

  public onDelete(event: Event): void {
    event.stopPropagation();
    this.isDeleteModalOpen.set(true);
  }

  public onConfirmDelete(): void {
    const mail = this.mail();
    if (mail) this.deleteMail.emit(mail.id);
    this.isDeleteModalOpen.set(false);
  }

  public onCancelDelete(): void {
    this.isDeleteModalOpen.set(false);
  }

  public onCardClick(): void {
    const mail = this.mail();
    if (mail) this.cardClick.emit(mail.id);
  }

  public getInitials(email: string): string {
    if (this.isCurrentUser()) {
      return 'ME';
    }
    return email?.substring(0, 2).toUpperCase();
  }

}

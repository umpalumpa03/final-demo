import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagingStore } from '../../store/messaging.store';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { LibraryTitle } from '../../../../storybook/shared/library-title/library-title';
import { EmailDetail } from '../../shared/ui/email-detail/email-detail';
import { RepliesCard } from '../../shared/ui/replies-card/replies-card';

@Component({
  selector: 'app-sent-draft-detail',
  imports: [EmailDetail, ButtonComponent, UiModal, LibraryTitle, RepliesCard],
  templateUrl: './sent-draft-detail.html',
  styleUrl: './sent-draft-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SentDraftDetail {
  private messagingStore = inject(MessagingStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public readonly deleteMail = output<number>();
  public isDeleteModalOpen = signal(false);

  private readonly emailId = this.route.snapshot.paramMap.get('id') || '';
  public emailDetail = this.messagingStore.emailDetail;
  public fromSent = this.route.snapshot.queryParamMap.get('sent') === 'true';
  public mailReplies = computed(() => this.messagingStore.mailReplies?.() || []);


  ngOnInit(): void { 
    this.messagingStore.getEmailById(+this.emailId);
    this.messagingStore.getMailReplies(+this.emailId);
  }

  public onDelete(event: Event): void {
    event.stopPropagation();
    this.isDeleteModalOpen.set(true);
  }

  public onConfirmDelete(): void {
    const mail = this.emailDetail?.();
    if (mail) {
      this.deleteMail.emit(mail.id);
      this.messagingStore.deleteMail(mail.id);
      this.isDeleteModalOpen.set(false);
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }

  public onCancelDelete(): void {
    this.isDeleteModalOpen.set(false);
  }

  public sendDraft(): void {
    const mail = this.emailDetail?.();
    if (mail) {
      const data = {
        subject: mail.subject,
        body: mail.body,
        recipient: mail.recipient,
        ccRecipients: mail.ccRecipients,
        isImportant: mail.isImportant,
        isDraft: false
      };
      this.messagingStore.sendDraft({ mailId: mail.id, data });
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, output, signal, ViewChild } from '@angular/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagingStore } from '../../store/messaging.store';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { LibraryTitle } from '../../../../storybook/shared/library-title/library-title';
import { EmailDetail } from '../../shared/ui/email-detail/email-detail';
import { RepliesCard } from '../../shared/ui/replies-card/replies-card';
import { ReplyForm } from '../../shared/ui/reply-form/reply-form';
import { Store } from '@ngrx/store';
import { selectCurrentUserEmail } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sent-draft-detail',
  imports: [EmailDetail, ButtonComponent, UiModal, LibraryTitle, RepliesCard, ReplyForm, TranslatePipe],
  templateUrl: './sent-draft-detail.html',
  styleUrl: './sent-draft-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SentDraftDetail {
  private readonly messagingStore = inject(MessagingStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  public readonly deleteMail = output<number>();
  public readonly isDeleteModalOpen = signal(false);

  private readonly emailId = this.route.snapshot.paramMap.get('id') || '';
  public readonly emailDetail = this.messagingStore.emailDetail;
  public readonly fromSent = this.route.snapshot.queryParamMap.get('sent') === 'true';
  public readonly mailReplies = computed(() => this.messagingStore.mailReplies?.() || []);
  public readonly isReplyOpen = signal(false);
  public readonly currentUserEmail = computed(() => this.store.selectSignal(selectCurrentUserEmail)() ?? '');
  public readonly isDeleting = computed(() => !!this.messagingStore.isDeleting?.());
  private readonly isDeletePending = signal(false);
  private readonly deletingEffect = effect(() => {
    if (this.isDeletePending() && !this.isDeleting()) {
      this.isDeletePending.set(false);
      this.isDeleteModalOpen.set(false);
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  });

  @ViewChild('replyCard') replyCard?: ElementRef;

  public onReply(): void {
    this.isReplyOpen.set(true);
    setTimeout(() => {
      this.replyCard?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
  }

  public onCancelReply(): void {
    this.isReplyOpen.set(false);
  }

  public onSendReply(body: string): void {
    this.messagingStore.sendMailReply({
      mailId: +this.emailId,
      body
    });
    this.isReplyOpen.set(false);
  }


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
      this.isDeletePending.set(true);
      this.deleteMail.emit(mail.id);
      this.messagingStore.deleteMail(mail.id);
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

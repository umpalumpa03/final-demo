import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, OnInit, output, signal, ViewChild } from '@angular/core';
import { EmailDetail } from '../../shared/ui/email-detail/email-detail';
import { MessagingStore } from '../../store/messaging.store';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { LibraryTitle } from '../../../../storybook/shared/library-title/library-title';
import { RepliesCard } from '../../shared/ui/replies-card/replies-card';
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReplyForm } from '../../shared/ui/reply-form/reply-form';
import { Store } from '@ngrx/store';
import { selectCurrentUserEmail } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';

@Component({
  selector: 'app-inbox-detail',
  imports: [EmailDetail, ButtonComponent, UiModal, LibraryTitle, RepliesCard, FormsModule, ReactiveFormsModule, ReplyForm, TranslatePipe],
  templateUrl: './inbox-detail.html',
  styleUrl: './inbox-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxDetail implements OnInit {
  private readonly messagingStore = inject(MessagingStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly alertService = inject(AlertService);
  private readonly translate = inject(TranslateService);
  public readonly deleteMail = output<number>();
  public readonly isFavoriteLoading = computed(() => !!this.messagingStore.isFavoriteLoading?.());
  private readonly emailId = this.route.snapshot.paramMap.get('id') || '';
  public readonly emailDetail = computed(() => this.messagingStore.emailDetail?.());
  public readonly isFavorite = computed(() => this.emailDetail()?.isFavorite ?? false);
  public readonly isDeleteModalOpen = signal(false);
  public readonly mailReplies = computed(() => this.messagingStore.mailReplies?.() || []);
  public readonly isReplyOpen = signal(false);
  public readonly currentUserEmail = computed(() => this.store.selectSignal(selectCurrentUserEmail)() ?? '');
  private readonly breakpointService = inject(BreakpointService);
  public readonly isMobile = this.breakpointService.isMobile;
  public readonly isDeleting = computed(() => !!this.messagingStore.isDeleting?.());
  public readonly deleteSuccess = computed(() => !!this.messagingStore.deleteSuccess?.());
  private readonly isDeletePending = signal(false);
  private readonly deletingEffect = effect(() => {
    if (this.isDeletePending() && !this.isDeleting()) {
      this.isDeletePending.set(false);
      this.isDeleteModalOpen.set(false);
      if (this.deleteSuccess()) {
        this.router.navigate(['..'], { relativeTo: this.route }).then(() => {
          this.alertService.success(this.translate.instant('messaging.storeSuccess.mailDeleted'), { variant: 'dismissible', title: 'Success!' });
        });
      }
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

  public toggleFavorite(): void {
    const email = this.emailDetail?.();
    if (email) {
      this.messagingStore.togleFavorite({ mailId: email.id, isFavorite: !email.isFavorite });
    }
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

}

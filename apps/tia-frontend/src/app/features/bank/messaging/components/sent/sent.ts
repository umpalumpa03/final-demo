import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';
import { TranslatePipe } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';
import { MailCard } from '../../shared/ui/mail-card/mail-card';
import { EmptyCard } from "../../shared/ui/empty-card/empty-card";
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Router } from '@angular/router';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { NavigationService } from '../../services/navigation.service';
import { Store } from '@ngrx/store';
import { selectCurrentUserEmail } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';

@Component({
  selector: 'app-sent',
  imports: [MailHeader, TranslatePipe, MailCard, EmptyCard, ErrorStates, RouteLoader, ScrollArea],
  templateUrl: './sent.html',
  styleUrl: './sent.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sent implements OnInit {
  private readonly messagingStore = inject(MessagingStore);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  public readonly mails = computed(() => {
    return this.messagingStore.mails()
  });
  public readonly loadsMoreMails = signal(false);
  public readonly isLoading = this.messagingStore.isLoading;
  public readonly error = this.messagingStore.error;
  public readonly total = computed(() => this.messagingStore.total()['sent'] ?? 0);
  private readonly nav = inject(NavigationService);
  public readonly currentUserEmail = computed(() => this.store.selectSignal(selectCurrentUserEmail)() ?? '');

  ngOnInit(): void {
    if (!(this.nav.previous()?.includes('sent') && this.messagingStore.mails().length > 0) || this.messagingStore.error()) {
      this.messagingStore.loadMails('sent');
      this.messagingStore.getTotalCount('sent');
    }
  }

  public goToDetail(mailId: number): void {
    this.router.navigate(['/bank/messaging/sent', mailId], { queryParams: { sent: true } });
  }

  public retry(): void {
    this.messagingStore.loadMails('sent');
  }

  public onScrollBottom(): void {
    const pagination = this.messagingStore.pagination();
    if (pagination.hasNextPage) {
      this.loadsMoreMails.set(true);
      this.messagingStore.loadMails('sent');
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';
import { TranslatePipe } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';
import { EmptyCard } from '../../shared/ui/empty-card/empty-card';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { MailCard } from '../../shared/ui/mail-card/mail-card';
import { Router } from '@angular/router';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { NavigationService } from '../../services/navigation.service';
import { Store } from '@ngrx/store';
import { selectCurrentUserEmail } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';

@Component({
  selector: 'app-draft',
  imports: [MailHeader, TranslatePipe, EmptyCard, RouteLoader, MailCard, ScrollArea],
  templateUrl: './draft.html',
  styleUrl: './draft.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Draft implements OnInit {
  private readonly messagingStore = inject(MessagingStore);
  private readonly router = inject(Router);
  private readonly nav = inject(NavigationService);
  private readonly store = inject(Store);
  public readonly mails = computed(() => {
    return this.messagingStore.mails()
  });
  public readonly loadsMoreMails = signal(false);
  public readonly isLoading = this.messagingStore.isLoading;
  public readonly selectedMailIds = signal<Set<number>>(new Set());
  public readonly draftsTotal = this.messagingStore.draftsTotal;
  public readonly currentUserEmail = computed(() => this.store.selectSignal(selectCurrentUserEmail)() ?? '');

  public isAllSelected(): boolean {
    return this.selectedMailIds().size === this.mails().length && this.mails().length > 0;
  }

  public toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.selectedMailIds.set(new Set(this.mails().map(m => m.id)));
    } else {
      this.selectedMailIds.set(new Set());
    }
  }

  public onMailChecked(mailId: number, checked: boolean): void {
    const set = new Set(this.selectedMailIds());
    if (checked) set.add(mailId);
    else set.delete(mailId);
    this.selectedMailIds.set(set);
  }

  public hasBulkSelection(): boolean {
    return this.selectedMailIds().size > 0;
  }

  public deleteSelectedMails(): void {
    const ids = Array.from(this.selectedMailIds());
    this.messagingStore.deleteAllMails(ids);
    this.selectedMailIds.set(new Set());
  }

  ngOnInit(): void {
    if (!(this.nav.previous()?.includes('draft') && this.messagingStore.mails().length > 0)) {
    this.messagingStore.loadMails('drafts');
    this.messagingStore.getDraftTotalCount(0);
    }
  }

  public deleteMail(mailId: number): void {
    this.messagingStore.deleteMail(mailId);
  }

  public goToDetail(mailId: number): void {
    this.router.navigate(['/bank/messaging/draft', mailId]);
  }

  public onScrollBottom(): void {
    const pagination = this.messagingStore.pagination();
    if (pagination.hasNextPage) {
      this.loadsMoreMails.set(true);
      this.messagingStore.loadMails('drafts');
    }
  }
}

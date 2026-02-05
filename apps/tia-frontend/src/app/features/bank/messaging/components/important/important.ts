import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';
import { TranslatePipe } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';
import { MailCard } from '../../shared/ui/mail-card/mail-card';
import { EmptyCard } from '../../shared/ui/empty-card/empty-card';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Router } from '@angular/router';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { NavigationService } from '../../services/navigation.service';
import { Store } from '@ngrx/store';
import { selectCurrentUserEmail } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';

@Component({
  selector: 'app-important',
  imports: [MailHeader, TranslatePipe, MailCard, EmptyCard, RouteLoader, ScrollArea],
  templateUrl: './important.html',
  styleUrl: './important.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Important implements OnInit {
  private readonly messagingStore = inject(MessagingStore);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  public readonly mails = computed(() => {
    return this.messagingStore.mails()
  });
  public readonly isLoading = this.messagingStore.isLoading;
  public readonly total = computed(() => this.messagingStore.total()['importants'] ?? 0);
  public readonly selectedMailIds = signal<Set<number>>(new Set());
  private readonly nav = inject(NavigationService);
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

  public markSelectedAsRead(): void {
    const ids = Array.from(this.selectedMailIds());
    this.messagingStore.markAllAsRead(ids);
    this.selectedMailIds.set(new Set());
  }

  ngOnInit(): void {
    if (!(this.nav.previous()?.includes('important') && this.messagingStore.mails().length > 0)) {
      this.messagingStore.loadMails('important');
      this.messagingStore.getTotalCount('importants');
    }
  }

  public markAsRead(mailId: number): void {
    this.messagingStore.markMailasRead(mailId);
  }

  public deleteMail(mailId: number): void {
    this.messagingStore.deleteMail(mailId);
  }

  public goToDetail(mailId: number): void {
    this.router.navigate(['/bank/messaging/important', mailId]);
    this.markAsRead(mailId);
  }

  public onScrollBottom(): void {
    const pagination = this.messagingStore.pagination();
    if (pagination.hasNextPage) {
      this.messagingStore.loadMails('important');
    }
  }
}
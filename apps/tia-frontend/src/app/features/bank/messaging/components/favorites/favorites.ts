import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';
import { TranslatePipe } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';
import { EmptyCard } from '../../shared/ui/empty-card/empty-card';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { MailCard } from '../../shared/ui/mail-card/mail-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [MailHeader, TranslatePipe, EmptyCard, RouteLoader, MailCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites implements OnInit {
  private messagingStore = inject(MessagingStore);
  private router = inject(Router);
  public mails = this.messagingStore.mails;
  public isLoading = this.messagingStore.isLoading;
  public selectedMailIds = signal<Set<number>>(new Set());

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
    this.messagingStore.loadMails('favorites');
  }

  public markAsRead(mailId: number): void {
    this.messagingStore.markMailasRead(mailId);
  }

  public deleteMail(mailId: number): void {
    this.messagingStore.deleteMail(mailId);
  }

   public goToDetail(mailId: number): void {
    this.router.navigate(['/bank/messaging/favorites', mailId]);
    this.markAsRead(mailId);
  }
}
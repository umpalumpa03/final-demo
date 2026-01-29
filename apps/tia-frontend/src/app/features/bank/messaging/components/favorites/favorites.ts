import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';
import { TranslatePipe } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';
import { EmptyCard } from '../../shared/ui/empty-card/empty-card';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { MailCard } from '../../shared/ui/mail-card/mail-card';

@Component({
  selector: 'app-favorites',
  imports: [MailHeader, TranslatePipe, EmptyCard, RouteLoader, MailCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites implements OnInit {
  private messagingStore = inject(MessagingStore);

  public mails = this.messagingStore.mails; 
  public isLoading = this.messagingStore.isLoading;
  public error = this.messagingStore.error;

  ngOnInit() {
    this.messagingStore.loadMails('favorites');
  }
}

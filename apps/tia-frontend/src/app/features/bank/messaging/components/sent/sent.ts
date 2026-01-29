import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MailHeader } from '../../shared/ui/mail-header/mail-header';
import { TranslatePipe } from '@ngx-translate/core';
import { MessagingStore } from '../../store/messaging.store';
import { MailCard } from '../../shared/ui/mail-card/mail-card';
import { EmptyCard } from "../../shared/ui/empty-card/empty-card";
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';

@Component({
  selector: 'app-sent',
  imports: [MailHeader, TranslatePipe, MailCard, EmptyCard, EmptyCard, RouteLoader],
  templateUrl: './sent.html',
  styleUrl: './sent.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sent implements OnInit {
    private messagingStore = inject(MessagingStore);

  public mails = this.messagingStore.mails; 
  public isLoading = this.messagingStore.isLoading;
  public error = this.messagingStore.error;

  ngOnInit() {
    this.messagingStore.loadMails('sent'); 
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EmailDetail } from '../../shared/ui/email-detail/email-detail';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ActivatedRoute } from '@angular/router';
import { MessagingStore } from '../../store/messaging.store';

@Component({
  selector: 'app-sent-draft-detail',
  imports: [EmailDetail, ButtonComponent],
  templateUrl: './sent-draft-detail.html',
  styleUrl: './sent-draft-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SentDraftDetail {
  private messagingStore = inject(MessagingStore);
  private route = inject(ActivatedRoute);

  private readonly emailId = this.route.snapshot.paramMap.get('id') || '';
  public emailDetail = this.messagingStore.emailDetail;
  public fromSent = this.route.snapshot.queryParamMap.get('sent') === 'true';

  ngOnInit(): void {
    this.messagingStore.getEmailById(+this.emailId);
  }
}

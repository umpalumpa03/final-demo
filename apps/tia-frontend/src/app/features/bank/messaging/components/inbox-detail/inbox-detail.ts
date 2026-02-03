import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { EmailDetail } from '../../shared/ui/email-detail/email-detail';
import { MessagingStore } from '../../store/messaging.store';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-inbox-detail',
  imports: [EmailDetail, ButtonComponent],
  templateUrl: './inbox-detail.html',
  styleUrl: './inbox-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxDetail implements OnInit {
  private messagingStore = inject(MessagingStore);
  private route = inject(ActivatedRoute);

  private readonly emailId = this.route.snapshot.paramMap.get('id') || '';
  public emailDetail = this.messagingStore.emailDetail;

  ngOnInit(): void {
    this.messagingStore.getEmailById(+this.emailId); 
  }

}

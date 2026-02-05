import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { EmailDetailData } from '../../../store/messaging.state';
import { DatePipe } from '@angular/common';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteLoader } from "@tia/shared/lib/feedback/route-loader/route-loader";
import { MessagingStore } from '../../../store/messaging.store';

@Component({
  selector: 'app-email-detail',
  imports: [Avatar, DatePipe, RouteLoader],
  templateUrl: './email-detail.html',
  styleUrl: './email-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailDetail {
  public readonly data = input<EmailDetailData | undefined>();
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messagingStore = inject(MessagingStore);
  public readonly isLoading = this.messagingStore.isLoading;

  public getInitials(email?: string): string {
    if (!email) return '';
    return email.substring(0, 2).toUpperCase();
  }

  public goBack(): void {
     this.router.navigate(['..'], { relativeTo: this.route });
  }
}

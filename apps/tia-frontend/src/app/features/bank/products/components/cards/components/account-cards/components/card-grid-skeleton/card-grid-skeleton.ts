import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-card-grid-skeleton',
  templateUrl: './card-grid-skeleton.html',
  styleUrls: ['./card-grid-skeleton.scss'],
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGridSkeleton {
  readonly cardIds = input.required<string[]>();
}
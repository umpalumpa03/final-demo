import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';

@Component({
  selector: 'app-card-preview',
  templateUrl: './card-preview.html',
  styleUrls: ['./card-preview.scss'],
  imports: [Spinner,TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPreview {
  readonly isLoading = input.required<boolean>();
  readonly designUri = input<string | null>(null);
}
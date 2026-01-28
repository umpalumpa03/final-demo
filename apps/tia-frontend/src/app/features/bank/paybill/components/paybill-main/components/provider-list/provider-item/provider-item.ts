import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-provider-item',
  imports: [Skeleton],
  templateUrl: './provider-item.html',
  styleUrl: './provider-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderItem {
  public readonly name = input<string>('');
  public readonly isLoading = input<boolean>(false);
  public readonly indicatorColor = input<string>('');

  public readonly selected = output<void>();
}

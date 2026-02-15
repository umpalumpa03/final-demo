import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { PaybillProvider } from '../../../../shared/models/paybill.model';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { ProviderItem } from '../provider-item/provider-item';
import { ErrorStates } from "@tia/shared/lib/feedback/error-states/error-states";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-provider-list',
  imports: [BasicCard, ScrollArea, Skeleton, ProviderItem, ErrorStates,TranslatePipe],
  templateUrl: './provider-list.html',
  styleUrl: './provider-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderList {
  public readonly isLoading = input<boolean>(false);
  public readonly headerTitle = input.required<string>();
  public readonly providers = input.required<PaybillProvider[]>();
  public readonly iconBgColor = input<string>();
  public readonly iconBgPath = input<string>();
  public readonly subtitle = input<string>();

  public readonly isRoot = input<boolean>(true);

  public readonly selected = output<string>();
  public readonly back = output<void>();
}

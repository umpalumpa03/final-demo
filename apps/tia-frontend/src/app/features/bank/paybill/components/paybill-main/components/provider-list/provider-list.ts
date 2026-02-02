import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  PaybillProvider,
  ProviderGroup,
  ProviderTreeNode,
} from '../../shared/models/paybill.model';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { ProviderItem } from './provider-item/provider-item';
import { groupProvidersByHierarchy } from '../../shared/utils/paybill.config';

@Component({
  selector: 'app-provider-list',
  imports: [BasicCard, ScrollArea, Skeleton, ProviderItem],
  templateUrl: './provider-list.html',
  styleUrl: './provider-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderList {
  public readonly isLoading = input<boolean>(false);
  public readonly categoryName = input.required<string>();
  public readonly providers = input.required<PaybillProvider[]>();
  public readonly iconBgColor = input<string>();
  public readonly iconBgPath = input<string>();
  public readonly subtitle = input<string>();
  public readonly selected = output<string>();

  public readonly providerGroups = computed(() =>
    groupProvidersByHierarchy(this.providers()),
  );
}

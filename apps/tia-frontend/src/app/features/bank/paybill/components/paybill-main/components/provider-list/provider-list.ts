import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  PaybillProvider,
} from '../../shared/models/paybill.model';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { ProviderItem } from './provider-item/provider-item';

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

  private readonly selectedParentId = signal<string | null>(null);

  public readonly displayItems = computed(() => {
    const all = this.providers();
    const parentId = this.selectedParentId();

    if (!parentId) {
      return all.filter((p) => !p.parentId);
    }

    return all.filter((p) => p.parentId === parentId);
  });

  public readonly currentHeader = computed(() => {
    const parentId = this.selectedParentId();
    if (!parentId) return this.categoryName();

    const activeParent = this.providers().find((p) => p.id === parentId);
    return activeParent?.name || this.categoryName();
  });

  public readonly isRoot = computed(() => !this.selectedParentId());

  public handleItemClick(provider: PaybillProvider): void {
    if (provider.isFinal) {
      this.selected.emit(provider.id);
    } else {
      this.selectedParentId.set(provider.id);
    }
  }

  public onBack(): void {
    const currentId = this.selectedParentId();
    if (!currentId) return;

    const currentItem = this.providers().find((p) => p.id === currentId);
    this.selectedParentId.set(currentItem?.parentId || null);
  }
}

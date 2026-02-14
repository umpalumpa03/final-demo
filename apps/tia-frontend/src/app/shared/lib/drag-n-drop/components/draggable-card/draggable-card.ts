import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  model,
} from '@angular/core';
import { DraggableItemType, TreeItem } from '../../model/drag.model';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';
import { DRAG_CONTAINER } from '../../model/drag.provider';
import { Checkboxes } from '@tia/shared/lib/forms/checkboxes/checkboxes';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { SelectOption } from '@tia/shared/lib/forms/models/dropdowns.model';
import { InputFieldValue } from '@tia/shared/lib/forms/models/input.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-draggable-card',
  imports: [ButtonComponent, Checkboxes, Dropdowns, TranslateModule],
  templateUrl: './draggable-card.html',
  styleUrl: './draggable-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraggableCard {
  private readonly container = inject(DRAG_CONTAINER, { optional: true });

  public itemData = input.required<DraggableItemType>();
  public isDragging = input(false);
  public isDropTarget = input(false);
  public canDelete = input(false);
  public editable = input(false);
  public hasButton = input(false);
  public buttonVariant = input<ButtonVariant>('ghost');
  public buttonContent = input('Play');
  public hasAddOption = input(false);
  public hasViewOption = input(false);
  public hasPagination = input(false);
  public paginationVariants = input<number[]>([10, 20, 40]);
  public expandable = input(false);
  public expanded = model(false);
  public hasCheckbox = input(false);
  public checked = model(false);
  public noCardBorder = input(false);
  public cardBackground = input(false);
  public readonly badgeCount = input<number | null>(null);
  public readonly badgeLabel = input<string>('');
  protected readonly itemDetails = computed(() => this.itemData() as TreeItem);

  protected readonly hasDetails = computed(() => {
    const item = this.itemDetails();
    return (
      !!item.serviceId || !!item.accountNumber || item.amountDue !== undefined
    );
  });

  public showHeadings = input(true);
  public readonly hasMinHeight = input(false);

  public dragStart = output<PointerEvent>();
  public remove = output<void>();
  public edit = output<void>();
  public add = output<void>();
  public viewOptionChange = output<boolean>();
  public paginationChange = output<number>();
  public expandedChange = output<boolean>();
  public checkedChange = output<boolean>();
  public buttonClick = output<void>();

  public isViewable = input<boolean>(true);
  public selectedPagination = signal<number>(10);

  protected readonly paginationOptions = computed<SelectOption[]>(() =>
    this.paginationVariants().map((v) => ({
      value: v,
      label: String(v),
    })),
  );

  protected readonly computedIsDragging = computed(() => {
    if (this.container) {
      return this.container.draggingId() === this.itemData().id;
    }
    return this.isDragging();
  });

  protected readonly computedIsDropTarget = computed(() => {
    if (this.container) {
      return this.container.dropTargetId() === this.itemData().id;
    }
    return this.isDropTarget();
  });

  public onDragStartPoint(event: PointerEvent): void {
    const target = event.target as HTMLElement;

    if (target.classList.contains('draggable-card__icon')) {
      event.preventDefault();
      this.dragStart.emit(event);
    }
  }

  public onRemove(): void {
    this.remove.emit();
  }

  public onEdit(): void {
    this.edit.emit();
  }

  public onAdd(): void {
    this.add.emit();
  }
  public onButtonClick(): void {
    this.buttonClick.emit();
  }
public onToggleView(): void {
    this.viewOptionChange.emit(!this.isViewable());
  }

  public onToggleExpanded(event: Event): void {
    event.stopPropagation();
    this.expanded.update((v) => !v);
    this.expandedChange.emit(this.expanded());
  }

  public onCheckedChange(value: boolean): void {
    this.checked.set(value);
    this.checkedChange.emit(value);
  }

  public onPaginationChange(value: InputFieldValue): void {
    if (
      value === null ||
      typeof value === 'boolean' ||
      value instanceof FileList
    )
      return;
    const numValue = Number(value);
    this.selectedPagination.set(numValue);
    this.paginationChange.emit(numValue);
  }
}

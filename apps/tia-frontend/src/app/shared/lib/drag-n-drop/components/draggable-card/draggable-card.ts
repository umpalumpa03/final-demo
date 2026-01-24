import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { DraggableItemType } from '../../model/drag.model';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';

@Component({
  selector: 'app-draggable-card',
  imports: [ButtonComponent],
  templateUrl: './draggable-card.html',
  styleUrl: './draggable-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraggableCard {
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

  public dragStart = output<PointerEvent>();
  public remove = output<void>();
  public edit = output<void>();
  public add = output<void>();
  public viewOptionChange = output<boolean>();
  public paginationChange = output<number>();

  //
  public isViewable = signal(true);
  public selectedPagination = signal(10);
  public onDragStartPoint(event: PointerEvent): void {
    event.preventDefault();
    this.dragStart.emit(event);
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

  public onToggleView(): void {
    this.isViewable.update((v) => !v);
    this.viewOptionChange.emit(this.isViewable());
  }
  public onPaginationChange(event: Event): void {
    const value = +(event.target as HTMLSelectElement).value;
    this.selectedPagination.set(value);
    this.paginationChange.emit(value);
  }
}

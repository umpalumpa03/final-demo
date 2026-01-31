import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  linkedSignal,
  signal,
} from '@angular/core';
import { DragBase } from '../../base/drag-base';
import {
  TreeItem,
  TreeGroupConfig,
  TreeItemMovedEvent,
  TreeItemReorderedEvent,
} from '../../model/drag.model';
import { DraggableCard } from '../draggable-card/draggable-card';
import { TreeService } from '../../services/tree.service';
import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { ErrorStateVariant } from '@tia/shared/lib/feedback/models/error-state.model';

@Component({
  selector: 'app-tree-container',
  imports: [DraggableCard, ErrorStates],
  templateUrl: './tree-container.html',
  styleUrl: './tree-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeContainer extends DragBase {
  private readonly treeService = inject(TreeService);

  // data
  public readonly groups = input.required<TreeGroupConfig[]>();
  public readonly items = input.required<TreeItem[]>();
  public readonly containerTitle = input('Tree View');
  public readonly containerDescription = input(
    'Drag items to reorder or move between groups',
  );

  // draggable card inputs
  public readonly canDelete = input(false);
  public readonly editable = input(false);
  public readonly hasButton = input(false);
  public readonly buttonVariant = input<ButtonVariant>('ghost');
  public readonly buttonContent = input('Play');
  public readonly hasAddOption = input(false);
  public readonly hasViewOption = input(false);
  public readonly hasPagination = input(false);
  public readonly paginationVariants = input<number[]>([10, 20, 40]);
  public readonly hasCheckbox = input(false);
  public readonly noBorder = input(false);
  public readonly contentHeader = input(false);
  public readonly noCardBorder = input(false);
  public readonly cardBackground = input(false);
  public readonly badgeLabel = input('Items:');

  //empty/error states
  public readonly errorVariant = input<ErrorStateVariant>('not-found');
  public readonly errorHeader = input('');
  public readonly errorMessage = input('');
  public readonly showErrorButton = input(false);

  // data outputs
  public readonly groupsChange = output<TreeGroupConfig[]>();
  public readonly itemsChange = output<TreeItem[]>();
  public readonly orderChange = output<string[]>();
  public readonly itemMoved = output<TreeItemMovedEvent>();
  public readonly itemReordered = output<TreeItemReorderedEvent>();
  public readonly expandedChange = output<{ id: string; expanded: boolean }>();
  public readonly checkedItemsChange = output<string[]>();

  // draggable card outputs
  public readonly itemRemoved = output<string>();
  public readonly itemEdited = output<string>();
  public readonly itemAdded = output<string>();
  public readonly groupRemoved = output<string>();
  public readonly groupEdited = output<string>();
  public readonly viewOptionChanged = output<{
    id: string;
    isViewable: boolean;
  }>();
  public readonly paginationChanged = output<{ id: string; value: number }>();
  public readonly buttonClicked = output<string>();

  public readonly internalGroups = linkedSignal<
    TreeGroupConfig[],
    TreeGroupConfig[]
  >({
    source: this.groups,
    computation: (newGroups) => [...newGroups],
  });

  public readonly internalItems = linkedSignal<TreeItem[], TreeItem[]>({
    source: this.items,
    computation: (newItems) => [...newItems],
  });

  public readonly checkedItemIds = signal<Set<string>>(new Set());

  public readonly itemsByGroup = computed(() =>
    this.treeService.groupItemsByGroup(
      this.internalGroups(),
      this.internalItems(),
    ),
  );

  public toggleExpanded(id: string): void {
    this.internalGroups.update((groups) =>
      groups.map((group) =>
        group.id === id ? { ...group, expanded: !group.expanded } : group,
      ),
    );
    const group = this.internalGroups().find((g) => g.id === id);
    if (group) {
      this.expandedChange.emit({ id, expanded: group.expanded ?? false });
      this.groupsChange.emit(this.internalGroups());
    }
  }

  public onDragStartHandler(id: string, event: PointerEvent): void {
    this.onDragStart(id, event);
  }

  protected override handleDrop(dragId: string, dropId: string): void {
    const items = this.internalItems();
    const groups = this.internalGroups();

    const dragGroup = groups.find((g) => g.id === dragId);
    if (dragGroup) {
      const newGroups = this.calculateReorderedItems(groups, dragId, dropId);
      if (newGroups !== groups) {
        this.internalGroups.set(newGroups);
        this.groupsChange.emit(newGroups);
      }
      return;
    }

    const dragItem = items.find((i) => i.id === dragId);
    if (!dragItem) return;

    const isGroupDrop = dropId.startsWith('group:');
    const toGroupId = isGroupDrop
      ? dropId.replace('group:', '')
      : (groups.find((g) => g.id === dropId)?.id ??
        items.find((i) => i.id === dropId)?.groupId);

    if (!toGroupId) return;

    const targetItemId = isGroupDrop ? undefined : dropId;
    const updatedItems = this.treeService.reorderItems(
      items,
      dragId,
      toGroupId,
      targetItemId,
      (list, dId, tId) => this.calculateReorderedItems(list, dId, tId),
    );

    if (updatedItems !== items) {
      this.internalItems.set(updatedItems);
      this.itemsChange.emit(updatedItems);
      this.orderChange.emit(updatedItems.map((i) => i.id));

      const finalItem = updatedItems.find((i) => i.id === dragId);
      const newOrder = finalItem?.order ?? 0;

      if (dragItem.groupId !== toGroupId) {
        this.itemMoved.emit({
          itemId: dragId,
          fromGroupId: dragItem.groupId,
          toGroupId,
          newOrder,
        });
      } else {
        this.itemReordered.emit({
          itemId: dragId,
          groupId: toGroupId,
          newOrder,
        });
      }
    }
  }

  public onRemoveItem(id: string): void {
    const updated = this.treeService.removeItem(this.internalItems(), id);
    this.internalItems.set(updated);
    this.itemsChange.emit(updated);
    this.itemRemoved.emit(id);
  }

  public onRemoveGroup(id: string): void {
    const { groups, items } = this.treeService.removeGroup(
      this.internalGroups(),
      this.internalItems(),
      id,
    );
    this.internalGroups.set(groups);
    this.internalItems.set(items);
    this.groupsChange.emit(groups);
    this.itemsChange.emit(items);
    this.groupRemoved.emit(id);
  }

  // checkbox methods
  public onGroupCheckedChange(groupId: string, checked: boolean): void {
    const updated = this.treeService.toggleGroupChecked(
      groupId,
      checked,
      this.internalItems(),
      this.checkedItemIds(),
    );
    this.checkedItemIds.set(updated);
    this.checkedItemsChange.emit(this.treeService.getCheckedItemIds(updated));
  }

  public onItemCheckedChange(itemId: string, checked: boolean): void {
    const updated = this.treeService.toggleItemChecked(
      itemId,
      checked,
      this.checkedItemIds(),
    );
    this.checkedItemIds.set(updated);
    this.checkedItemsChange.emit(this.treeService.getCheckedItemIds(updated));
  }

  public isGroupChecked(groupId: string): boolean {
    return this.treeService.isGroupFullyChecked(
      groupId,
      this.internalItems(),
      this.checkedItemIds(),
    );
  }

  public isGroupIndeterminate(groupId: string): boolean {
    return this.treeService.isGroupPartiallyChecked(
      groupId,
      this.internalItems(),
      this.checkedItemIds(),
    );
  }

  public isItemChecked(itemId: string): boolean {
    return this.checkedItemIds().has(itemId);
  }

  public onEditItem(id: string): void {
    this.itemEdited.emit(id);
  }

  public onEditGroup(id: string): void {
    this.groupEdited.emit(id);
  }

  public onAddItem(id: string): void {
    this.itemAdded.emit(id);
  }

  public onViewOptionChange(id: string, isViewable: boolean): void {
    this.viewOptionChanged.emit({ id, isViewable });
  }

  public onPaginationChange(id: string, value: number): void {
    this.paginationChanged.emit({ id, value });
  }

  public onButtonClick(id: string): void {
    this.buttonClicked.emit(id);
  }
}

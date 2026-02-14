import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DragCard } from '@tia/shared/lib/drag-n-drop/components/drag-card/drag-card';
import {
  DraggableItemType,
  BoardConfig,
  KanbanItem,
  CardMovedEvent,
  CardReorderedEvent,
  TreeItem,
  TreeGroupConfig,
  TreeItemMovedEvent,
  TreeItemReorderedEvent,
} from '@tia/shared/lib/drag-n-drop/model/drag.model';
import {
  items,
  boards,
  kanbanItems,
  treeGroups,
  treeItems,
} from '../config/draggable-data.config';
import { KanbanBoard } from '@tia/shared/lib/drag-n-drop/components/kanban-board/kanban-board';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { InstructionsCard } from '../instructions-card/instructions-card';
import { DraggableCard } from '@tia/shared/lib/drag-n-drop/components/draggable-card/draggable-card';
import { DragContainer } from '@tia/shared/lib/drag-n-drop/components/drag-container/drag-container';
import { DragItemDirective } from '@tia/shared/lib/drag-n-drop/directives/drag-item.directive';
import { TreeContainer } from '@tia/shared/lib/drag-n-drop/components/tree-container/tree-container';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-drag-and-drop-container',
  imports: [
    DragCard,
    KanbanBoard,
    LibraryTitle,
    InstructionsCard,
    DraggableCard,
    DragContainer,
    DragItemDirective,
    TreeContainer,
    TranslatePipe,
  ],
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropContainer implements OnInit {
  private translate = inject(TranslateService);
  private breakpointObserver = inject(BreakpointObserver);

  public items: DraggableItemType[] = [...items(this.translate)];
  public listItems: DraggableItemType[] = [...items(this.translate)];
  public boards = signal<BoardConfig[]>([...boards(this.translate)]);
  public kanbanItems: KanbanItem[] = [...kanbanItems(this.translate)];
  public myItems: DraggableItemType[] = [...items(this.translate)];
  public treeGroups = signal<TreeGroupConfig[]>([
    ...treeGroups(this.translate),
  ]);
  public treeItems = signal<TreeItem[]>([...treeItems(this.translate)]);
  public canDelete = true;

  private isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 500px)'),
    {
      initialValue: { matches: false, breakpoints: {} } as BreakpointState,
    },
  );

  public colspans = computed(() => {
    const mobile = this.isMobile();
    return mobile?.matches ? [1, 1, 1, 1] : [2, 1, 1, 2];
  });

  ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.items = [...items(this.translate)];
      this.listItems = [...items(this.translate)];
      this.boards.set([...boards(this.translate)]);
      this.kanbanItems = [...kanbanItems(this.translate)];
      this.myItems = [...items(this.translate)];
      this.treeGroups.set([...treeGroups(this.translate)]);
      this.treeItems.set([...treeItems(this.translate)]);
    });
  }

  public onItemRemoved(id: string): void {}

  public onOrderChange(ids: string[]): void {}

  public onOrderChangeList(ids: string[]): void {}

  public onCardMoved(event: CardMovedEvent): void {}

  public onCardReordered(event: CardReorderedEvent): void {}

  public onCardRemoved(id: string): void {}

  public onItemEdited(id: string): void {}

  public onItemAdded(id: string): void {}

  public onViewOptionChanged(event: {
    id: string;
    isViewable: boolean;
  }): void {}

  public onPaginationChanged(event: { id: string; value: number }): void {}

  public onItemsChange(items: DraggableItemType[]): void {
    this.myItems = items;
  }

  public onRemove(id: string): void {}

  public onEdit(id: string): void {}

  public onContainerOrderChange(ids: string[]): void {}

  public onTreeGroupsChange(groups: TreeGroupConfig[]): void {
    this.treeGroups.set(groups);
  }

  public onTreeItemsChange(items: TreeItem[]): void {
    this.treeItems.set(items);
  }

  public onTreeItemMoved(event: TreeItemMovedEvent): void {}

  public onTreeItemReordered(event: TreeItemReorderedEvent): void {}

  public onTreeExpandedChange(event: { id: string; expanded: boolean }): void {}

  public onCheckedItemsChange(itemIds: string[]): void {}

  public movenotAllowed(event: boolean): void {}
}

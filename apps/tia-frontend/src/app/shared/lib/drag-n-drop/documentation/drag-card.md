documentation of whole draggable container

USAGE example

      <app-drag-card
        [items]="items"
        (itemsChange)="items = $event"
        layout="grid"
         [columns]="{ default: 2, md: 1, sm: 1 }"
        cardTitle="Draggable Cards (Grid)"
        cardDescription="Drag cards to reorder them in a grid layout"
        [canDelete]="true"
        [editable]="true"
        [hasButton]="true"
        [buttonVariant]="'ghost'"
        [buttonContent]="'Play'"
        [hasAddOption]="true"
        [hasViewOption]="true"
        [hasPagination]="true"
        [paginationVariants]="[10, 20, 40]"
        [hasCheckbox]="true"
        (orderChange)="onDragCardOrderChange($event)"
        (itemRemoved)="onDragCardItemRemoved($event)"
        (itemEdited)="onDragCardItemEdited($event)"
        (itemAdded)="onDragCardItemAdded($event)"
        (viewOptionChanged)="onDragCardViewOptionChanged($event)"
        (paginationChanged)="onDragCardPaginationChanged($event)"
        (buttonClicked)="onDragCardButtonClicked($event)"
        (checkedChanged)="onDragCardCheckedChanged($event)"
      />
      <app-drag-card
        [items]="listItems"
        (itemsChange)="listItems = $event"
        layout="list"
        cardTitle="Sortable List"
        cardDescription="Drag cards to reorder them in a list layout"
        [canDelete]="true"
        [editable]="true"
        [hasButton]="true"
        [hasAddOption]="true"
        [hasViewOption]="true"
        [hasPagination]="true"
        [hasCheckbox]="true"
        (orderChange)="onDragCardListOrderChange($event)"
        (itemRemoved)="onDragCardListItemRemoved($event)"
        (itemEdited)="onDragCardListItemEdited($event)"
        (itemAdded)="onDragCardListItemAdded($event)"
        (viewOptionChanged)="onDragCardListViewOptionChanged($event)"
        (paginationChanged)="onDragCardListPaginationChanged($event)"
        (buttonClicked)="onDragCardListButtonClicked($event)"
        (checkedChanged)="onDragCardListCheckedChanged($event)"
      />

# Draggable Card Component Documentation

### REQUIRED

- **[items]** -> Array of card data objects.

  {
  id: string | number; // Required for tracking and emissions
  title: string; // Main text
  subtitle: string; // Secondary text
  icon?: string; // Optional: path to icon shown next to text
  }

- **(itemsChange)="items = $event"** -> **MUST** be used for the parent to update the list order after a drag-and-drop action.

---

### INPUTS

- **[cardTitle]** -> `h2` heading for the card wrapper.
- **[cardDescription]** -> `p` description for the card wrapper.
- **layout** -> `'grid'` | `'list'`. Defines the visual arrangement.
- **[columns]** -> In `grid` layout, defines column count. Supports a single number (e.g., `3`) or a responsive object: `{ default: 2, md: 1, sm: 1 }`.
- **[hasCheckbox]** -> `true` | `false`. Shows a selection checkbox on the card.
- **[expandable]** -> `true` | `false`. Shows a toggle arrow to expand/collapse `<ng-content>`.
- **[canDelete]** -> `true` | `false`. Shows the trash/remove icon.
- **[editable]** -> `true` | `false`. Shows the edit icon.
- **[hasAddOption]** -> `true` | `false`. Shows the plus icon.
- **[hasViewOption]** -> `true` | `false`. Shows the eye icon (visibility toggle).
- **[hasButton]** -> `true` | `false`. Shows a main action button.
- **[buttonVariant]** -> Button style variant (e.g., `'ghost'`, `'primary'`). Default: `'ghost'`.
- **[buttonContent]** -> Text displayed inside the button. Default: `'Play'`.
- **[hasPagination]** -> `true` | `false`. Shows a limit/pagination dropdown.
- **[paginationVariants]** -> Array of numbers for dropdown options. Default: `[10, 20, 40]`.

---

### OUTPUTS

- **(orderChange)="onOrderChange($event)"** -> Returns an array of IDs in the new order after dragging.
- **(itemRemoved)="onItemRemoved($event)"** -> Returns the `id` of the card to be deleted.
- **(itemEdited)="onItemEdited($event)"** -> Returns the `id` when the edit icon is clicked.
- **(itemAdded)="onItemAdded($event)"** -> Returns the `id` when the plus icon is clicked.
- **(buttonClicked)="onButtonClicked($event)"** -> Returns the `id` when the main action button is clicked.
- **(checkedChanged)="onCheckedChanged($event)"** -> Returns `{ id: any, checked: boolean }`.
- **(viewOptionChanged)="onViewOptionChanged($event)"** -> Returns `{ id: any, isViewable: boolean }`.
- **(paginationChanged)="onPaginationChanged($event)"** -> Returns `{ id: any, value: number }`.

---

## 2. KANBAN BOARD

Multi-column board for managing task stages.

### REQUIRED

- **[boards]** -> Array of board configs.
  {
  id: string | number; // unique board id
  title: string; // board column title
  }

  ```

  ```

- **[items]** -> Array of kanban items.

  {
  id: string | number; // unique item id
  title: string; // card title
  subtitle: string; // card subtitle
  boardId: string | number; // which board this item belongs to
  order: number; // position in the board
  }

  ```

  ```

- **(itemsChange)="kanbanItems = $event"** -> **MUST** be used for parent to update elements.

---

### INPUTS

- **[boardTitle]** -> `h2` of the kanban wrapper itself.
- **[boardDescription]** -> `p` of the kanban wrapper itself.
- **[canDelete]** -> `true` | `false`. Default: `false`.
- **[editable]** -> `true` | `false`. Default: `false`.
- **[hasAddOption]** -> `true` | `false`. Default: `false`.
- **[hasViewOption]** -> `true` | `false`. Default: `false`.
- **[hasCheckbox]** -> `true` | `false`. Default: `false`.
- **[hasButton]** -> `true` | `false`. Default: `false`.
- **[hasPagination]** -> `true` | `false`. Default: `false`.

---

### OUTPUTS

- **(cardMoved)="onCardMoved($event)"** -> When card moves between boards. Returns:

  {
  cardId: ,
  fromBoardId: ,
  toBoardId: ,
  newOrder:
  }

- **(cardReordered)="onCardReordered($event)"** -> When card reorders within same board. Returns:

  {
  cardId: ,
  boardId: ,
  newOrder:
  }

- **(cardRemoved)** -> Returns removed card `id`.
- **(cardEdited)** -> Returns `id`.
- **(cardAdded)** -> Returns `id`.
- **(buttonClicked)** -> Returns `id`.
- **(checkedChanged)** -> Returns `{ id, checked: boolean }`.
- **(viewOptionChanged)** -> Returns `{ id, isViewable: boolean }`.
- **(paginationChanged)** -> Returns `{ id, value: number }`.

---

### NOTE

When board is empty, drop zone shows "Drop items here" message with visual highlight on drag over.

# UI COMPONENTS DOCUMENTATION

## 1. DRAG CONTAINER (Flexible Custom Content)

Use this when you need full control over the card's internal layout using `<ng-content>`. This is the flexible wrapper for custom-rendered cards.

### USAGE EXAMPLE

      <!-- Drag Container -->
      <app-drag-container
        [items]="myItems"
        [layout]="'grid'"
        [columns]="3"
        [containerTitle]="'Add Content of Your Choice'"
        [containerDescription]="'Drag cards with custom content'"
        (itemsChange)="onContainerItemsChange($event)"
        (orderChange)="onContainerOrderChange($event)"
      >
        @for (item of myItems; track item.id) {
        <app-draggable-card
          [itemData]="item"
          [canDelete]="true"
          [editable]="true"
          [hasButton]="true"
          [buttonVariant]="'ghost'"
          [buttonContent]="'Play'"
          [hasAddOption]="true"
          [hasViewOption]="true"
          [hasPagination]="true"
          [paginationVariants]="[10, 20, 40]"
          [hasCheckbox]="true"
          (remove)="onContainerRemove(item.id)"
          (edit)="onContainerEdit(item.id)"
          (add)="onContainerAdd(item.id)"
          (viewOptionChange)="onContainerViewChange(item.id, $event)"
          (paginationChange)="onContainerPaginationChange(item.id, $event)"
          (buttonClick)="onContainerButtonClick(item.id)"
          (checkedChange)="onContainerCheckedChange(item.id, $event)"
          appDragItem
        >
          <div class="my-custom-layout">
            <span class="my-custom-layout__tag">Content of your choice</span>
            <p class="my-custom-layout__text">{{ item.subtitle }}</p>
            <div class="my-custom-layout__meta">
              <span class="my-custom-layout__id">#{{ item.id }}</span>
              <div class="my-custom-layout__dot"></div>
              <span class="my-custom-layout__date">Jan 2026</span>
            </div>
          </div>
        </app-draggable-card>
        }
      </app-drag-container>

### REQUIRED FOR CUSTOM DRAGGING

**[attr.data-card-id]="item.id"** -> MUST be set on the app-draggable-card for drag detection.
**(dragStart)="onDragStart(item.id, $event)"** -> MUST connect to the container's drag handler to initiate movement.
**appDragItem** -> Directive required on the card element to enable reordering functionality.

### INPUTS (Container)

[containerTitle] -> h2 heading for the container wrapper.
[containerDescription] -> p description for the container wrapper.
layout -> 'grid' | 'list'. Defines how cards are arranged. Default: 'grid'.
[columns] -> Number of columns (e.g., 3) or responsive object { default: 3, md: 2, sm: 1 }.

### UTPUTS (Container)

**(orderChange)** -> Triggered when cards are swapped. Returns: { dragId: any, dropId: any }.
**(itemsChange)** -> Emits the updated items array to the parent component.

### PARENT COMPONENT SETUP:

    // signal for items
    items = signal<DraggableItemType[]>([...]);

    // swap handler
    onSwap(event: { dragId: string; dropId: string }): void {
      const current = this.items();
      const dragIndex = current.findIndex(i => i.id === event.dragId);
      const dropIndex = current.findIndex(i => i.id === event.dropId);

      const newItems = [...current];
      [newItems[dragIndex], newItems[dropIndex]] = [newItems[dropIndex], newItems[dragIndex]];

      this.items.set(newItems);
    }

### NOTE: use drag-container when you need full flexibility over card content. use drag-card when all cards have same structure.

---

DRAGGABLE CARD (child component, used inside drag-card, kanban-board, and drag-container)

## INPUTS

**[itemData]** -> The data object: { id, title, subtitle, icon }.

**[canDelete]** -> true | false. Enables the trash icon.

[editable] -> true | false. Enables the edit icon.

[expandable] -> true | false. Shows arrow to toggle visibility of <ng-content>.

[hasCheckbox] -> true | false. Shows a selection checkbox.

[hasAddOption] -> true | false. Shows the plus icon.

[hasViewOption] -> true | false. Shows the eye icon (visibility toggle).

[hasPagination] -> true | false. Shows a limit/pagination dropdown.

[paginationVariants] -> Array of numbers for the dropdown (e.g., [10, 20, 50]).

[hasButton] -> true | false. Shows the custom action button.

[buttonVariant] -> Button style (e.g., 'ghost', 'primary'). Default: 'ghost'.

[buttonContent] -> Text inside the button. Default: 'Play'.

OUTPUTS
**(remove)** -> Emits the card id when the trash icon is clicked.

**(edit)** -> Emits the card id when the edit icon is clicked.

**(add)** -> Emits the card id when the plus icon is clicked.

**(buttonClick)** -> Emits the card id when the main action button is clicked.

**(checkedChange)** -> Emits boolean state when the checkbox is toggled.

**(viewOptionChange)** -> Emits boolean state when the eye icon is toggled.

**(paginationChange)** -> Emits the selected number from the dropdown.

**(dragStart)** -> Emits the pointer event to start the dragging process.

### NG-CONTENT: any content placed between <app-draggable-card>...</app-draggable-card> tags renders below the default card content

---

# Tree Container Documentation

Expandable groups with draggable items. Use when you need hierarchical structure with expandable parent groups and draggable child items.

---

## Usage Example

   
      <app-tree-container
        [groups]="treeGroups"
        [items]="treeItems"
        containerTitle="Tree View"
        containerDescription="Drag items to reorder or move between groups"
        [canDelete]="true"
        [editable]="true"
        [hasButton]="true"
        [buttonVariant]="'ghost'"
        [buttonContent]="'Play'"
        [hasAddOption]="true"
        [hasViewOption]="true"
        [hasPagination]="true"
        [paginationVariants]="[10, 20, 40]"
        [hasCheckbox]="true"
        (groupsChange)="onTreeGroupsChange($event)"
        (itemsChange)="onTreeItemsChange($event)"
        (orderChange)="onTreeOrderChange($event)"
        (itemMoved)="onTreeItemMoved($event)"
        (itemReordered)="onTreeItemReordered($event)"
        (expandedChange)="onTreeExpandedChange($event)"
        (checkedItemsChange)="onTreeCheckedItemsChange($event)"
        (itemRemoved)="onTreeItemRemoved($event)"
        (itemEdited)="onTreeItemEdited($event)"
        (itemAdded)="onTreeItemAdded($event)"
        (groupRemoved)="onTreeGroupRemoved($event)"
        (groupEdited)="onTreeGroupEdited($event)"
        (viewOptionChanged)="onTreeViewOptionChanged($event)"
        (paginationChanged)="onTreePaginationChanged($event)"
        (buttonClicked)="onTreeButtonClicked($event)"
      />

---

## Required

**[groups]** -> Array of group configs.

```typescript
{
  id: string;         // Unique group id
  title: string;      // Group title
  subtitle?: string;  // Optional group subtitle
  icon?: string;      // Optional icon path
  expanded?: boolean; // Initial expanded state (default: false)
}
```

**[items]** -> Array of tree items.

```typescript
{
  id: string; // Unique item id
  title: string; // Card title
  subtitle: string; // Card subtitle
  groupId: string; // Which group this item belongs to
  order: number; // Position in the group
}
```

**(groupsChange)="treeGroups = $event"** -> **MUST** be used for parent to update groups after reorder.

**(itemsChange)="treeItems = $event"** -> **MUST** be used for parent to update items after drag-and-drop.

---

## Inputs

**[containerTitle]** -> `h2` heading for the tree wrapper.

**[containerDescription]** -> `p` description for the tree wrapper.

**[canDelete]** -> `true` | `false`. Shows trash icon on items and groups. Default: `false`.

**[editable]** -> `true` | `false`. Shows edit icon on items and groups. Default: `false`.

**[hasButton]** -> `true` | `false`. Shows action button on items. Default: `false`.

**[buttonVariant]** -> Button style variant (e.g., `'ghost'`, `'primary'`). Default: `'ghost'`.

**[buttonContent]** -> Text inside the button. Default: `'Play'`.

**[hasAddOption]** -> `true` | `false`. Shows plus icon on items. Default: `false`.

**[hasViewOption]** -> `true` | `false`. Shows eye toggle icon on items. Default: `false`.

**[hasPagination]** -> `true` | `false`. Shows pagination dropdown on items. Default: `false`.

**[paginationVariants]** -> Array of numbers for dropdown options. Default: `[10, 20, 40]`.

**[hasCheckbox]** -> `true` | `false`. Shows selection checkbox on items. Default: `false`.

---

## Outputs

### Item Movement

**(itemMoved)="onItemMoved($event)"** -> When item moves between groups. Returns:

```typescript
{
  itemId: string;
  fromGroupId: string;
  toGroupId: string;
  newOrder: number;
}
```

**(itemReordered)="onItemReordered($event)"** -> When item reorders within same group. Returns:

```typescript
{
  itemId: string;
  groupId: string;
  newOrder: number;
}
```

**(orderChange)="onOrderChange($event)"** -> Returns array of item IDs in new order.

### Item Actions

**(itemRemoved)="onItemRemoved($event)"** -> Returns item `id` when trash icon clicked.

**(itemEdited)="onItemEdited($event)"** -> Returns item `id` when edit icon clicked.

**(itemAdded)="onItemAdded($event)"** -> Returns item `id` when plus icon clicked.

**(buttonClicked)="onButtonClicked($event)"** -> Returns item `id` when action button clicked.

**(checkedItemsChange)="onCheckedItemsChange($event)"** -> Returns `{ id: string, checked: boolean }`.

**(viewOptionChanged)="onViewOptionChanged($event)"** -> Returns `{ id: string, isViewable: boolean }`.

**(paginationChanged)="onPaginationChanged($event)"** -> Returns `{ id: string, value: number }`.

### Group Actions

**(groupRemoved)="onGroupRemoved($event)"** -> Returns group `id` when trash icon clicked. Also removes all items in that group.

**(groupEdited)="onGroupEdited($event)"** -> Returns group `id` when edit icon clicked.

**(expandedChange)="onExpandedChange($event)"** -> When group expanded/collapsed. Returns `{ id: string, expanded: boolean }`.

---

## Data Config Example

```typescript
import { TreeGroupConfig, TreeItem } from '@tia/shared/lib/draggable';

export const treeGroups: TreeGroupConfig[] = [
  { id: '1', title: 'Group 1', subtitle: 'First group', expanded: true },
  { id: '2', title: 'Group 2', subtitle: 'Second group', expanded: true },
  { id: '3', title: 'Group 3', subtitle: 'Third group', expanded: false },
];

export const treeItems: TreeItem[] = [
  { id: '1', title: 'Child 1', subtitle: 'Drag to reorder', groupId: 'g1', order: 0 },
  { id: '2', title: 'Child 2', subtitle: 'Drag to reorder', groupId: 'g1', order: 1 },
  { id: '3', title: 'Child 3', subtitle: 'Drag to reorder', groupId: 'g1', order: 2 },
  { id: '4', title: 'Child 4', subtitle: 'Drag to reorder', groupId: 'g2', order: 0 },
  { id: '5', title: 'Child 5', subtitle: 'Drag to reorder', groupId: 'g2', order: 1 },
  { id: '6', title: 'Child 6', subtitle: 'Drag to reorder', groupId: 'g3', order: 0 },
];
```

---

## Notes

- Groups are draggable and can be reordered
- Items can be dragged between groups or reordered within same group
- Expand icon only shows when group has children
- When group is empty, drop zone shows "Drop items here" message with visual highlight on drag over
- Expand/collapse has smooth CSS animation
- When a group is removed, all items belonging to that group are also removed

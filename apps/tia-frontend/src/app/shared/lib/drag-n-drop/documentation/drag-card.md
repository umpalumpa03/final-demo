documentation of whole draggable container

USAGE example

    <div class="drag-frame__content">
      <app-drag-card
        [items]="items"
        (itemsChange)="items = $event"
        (itemRemoved)="onItemRemoved($event)"
        layout="grid"
        (orderChange)="onOrderChange($event)"
      />
      <app-drag-card
        [items]="listItems"
        (itemsChange)="listItems = $event"
        (itemRemoved)="onItemRemoved($event)"
        [canDelete]="canDelete"
        layout="list"
        [columns]="3"
        (orderChange)="onOrderChangeList($event)"
      />
    </div>

REQUIRED:
[items] ->Card data object containing title and subtitle to display. (Data which will be displayed)
{
title: -> title
subtitle: -> subtitle
}

(itemsChange)="items = $event" -> is a MUST for parent to know how to update elements

INPUTS
[canDelete] -> true or false (you want removable card or not) false by default
[cardTitle] -> h2 of the card wrapper itself
[cardDescription] => p of the card wrapper itself
[editable] -> true or false (show edit icon) false by default
[hasButton] -> true or false (show button) false by default
[buttonVariant] -> button style variant, 'ghost' by default
[buttonContent] -> text inside button, 'Play' by default
[hasAddOption] -> true or false (show plus icon) false by default
[hasViewOption] -> true or false (show eye icon toggle) false by default
[hasPagination] -> true or false (show pagination dropdown) false by default
[paginationVariants] -> array of numbers for dropdown options, [10, 20, 40] by default

for layout change
layout = grid / list
in case of grid
[columns]="3" (how many you want)

OUTPUTS
(itemRemoved)="onItemRemoved($event)" -> remove, returns id
(orderChange)="onOrderChange($event)"-> track order you will get array of ids, in a new order on each drag and drop, when using several app cards in one component, of course separate methods should be called, i mean this one -> onOrderChange(), same with onItemRemoved()
(itemEdited)="onItemEdited($event)" -> when edit icon clicked, returns id
(itemAdded)="onItemAdded($event)" -> when plus icon clicked, returns id
(viewOptionChanged)="onViewOptionChanged($event)" -> when eye icon toggled, returns:
{
  id: -> which card
  isViewable: -> true or false
}
(paginationChanged)="onPaginationChanged($event)" -> when pagination dropdown changed, returns:
{
id: -> which card
value: -> selected number
}

---

KANBAN BOARD

USAGE example

    <app-kanban-board
      [boards]="boards"
      [items]="kanbanItems"
      [canDelete]="true"
      (itemsChange)="kanbanItems = $event"
      (cardMoved)="onCardMoved($event)"
      (cardReordered)="onCardReordered($event)"
      (cardRemoved)="onCardRemoved($event)"
    />

REQUIRED:
[boards] -> array of board configs
{
id: -> unique board id
title: -> board column title
}

[items] -> array of kanban items
{
id: -> unique item id
title: -> card title
subtitle: -> card subtitle
boardId: -> which board this item belongs to
order: -> position in the board
}

(itemsChange)="kanbanItems = $event" -> is a MUST for parent to know how to update elements

INPUTS
[canDelete] -> true or false (you want removable card or not) false by default
[boardTitle] -> h2 of the kanban wrapper itself
[boardDescription] -> p of the kanban wrapper itself

OUTPUTS
(cardMoved)="onCardMoved($event)" -> when card moves between boards, returns:
{
cardId: -> which card moved
fromBoardId: -> from which board
toBoardId: -> to which board
newOrder: -> new position in target board
}

(cardReordered)="onCardReordered($event)" -> when card reorders within same board, returns:
{
cardId: -> which card reordered
boardId: -> in which board
newOrder: -> new position
}

(cardRemoved)="onCardRemoved($event)" -> returns removed card id

NOTE: when board is empty, drop zone shows "Drop items here" message with visual highlight on drag over

---

DRAG CONTAINER (flexible wrapper for custom card content)

USE WHEN: you need different content inside each card, full control over card rendering

USAGE example

    <app-drag-container
      layout="grid"
      [columns]="2"
      (orderChange)="onSwap($event)"
    >
      @for(item of items(); track item.id) {
        <app-draggable-card
          [attr.data-card-id]="item.id"
          [itemData]="item"
          (dragStart)="onDragStart(item.id, $event)"
        >
          <!-- any custom content here -->
          @if(item.id === '1') {
            <div>Unique content for first card</div>
          } @else {
            <p>Different content for other cards</p>
          }
        </app-draggable-card>
      }
    </app-drag-container>

REQUIRED:
[attr.data-card-id]="item.id" -> MUST be set on each draggable-card for drag detection
(dragStart)="onDragStart(item.id, $event)" -> MUST connect to container's drag handler

INPUTS
layout -> 'grid' or 'list', 'grid' by default
[columns] -> number of columns for grid layout, 2 by default

OUTPUTS
(orderChange)="onSwap($event)" -> when cards swapped, returns:
{
dragId: -> id of dragged card
dropId: -> id of drop target card
}

PARENT COMPONENT SETUP:

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

NOTE: use drag-container when you need full flexibility over card content. use drag-card when all cards have same structure.

---

DRAGGABLE CARD (child component, used inside drag-card, kanban-board, and drag-container)

INPUTS
[itemData] -> required, card data object
{
title: -> title
subtitle: -> subtitle
icon: -> optional icon path
}
[canDelete] -> true or false (show trash icon) false by default
[editable] -> true or false (show edit icon) false by default
[hasButton] -> true or false (show button) false by default
[buttonVariant] -> button style variant
[buttonContent] -> text inside button
[hasAddOption] -> true or false (show plus icon) false by default
[hasViewOption] -> true or false (show eye toggle icon) false by default
[hasPagination] -> true or false (show pagination dropdown) false by default
[paginationVariants] -> array of numbers for dropdown options

OUTPUTS
(dragStart) -> emits PointerEvent when drag handle clicked
(remove) -> emits when trash icon clicked
(edit) -> emits when edit icon clicked
(add) -> emits when plus icon clicked
(viewOptionChange) -> emits boolean when eye icon toggled (true = visible, false = hidden)
(paginationChange) -> emits selected number when dropdown changed

NG-CONTENT: any content placed between <app-draggable-card>...</app-draggable-card> tags renders below the default card content

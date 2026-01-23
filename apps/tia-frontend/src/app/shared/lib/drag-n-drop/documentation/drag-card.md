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

for layout change
layout = grid / list
in case of grid
[columns]="3" (how many you want)

OUTPUTS
(itemRemoved)="onItemRemoved($event)" -> remove
(orderChange)="onOrderChange($event)"-> track order you will get array of ids, in a new order on each drag and drop, when using several app cards in one component, of course separate methods should be called, i mean this one -> onOrderChange(), same with onItemRemoved()

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

draggable card:

## DraggableCard Component

### Inputs

itemData (required, DraggableItemType) - Card data object containing title and subtitle to display. (Data which will be displayed)
{
title: -> title
subtitle: -> subtitle
}
canDelete -> pass true if you want trash can icon

### Outputs

remove (void) - Emits when user clicks the delete button.

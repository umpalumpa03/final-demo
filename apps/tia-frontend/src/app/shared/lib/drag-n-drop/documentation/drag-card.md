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

for layout change
layout = grid / list
in case of grid
[columns]="3" (how many you want)

OUTPUTS
(itemRemoved)="onItemRemoved($event)" -> remove
(orderChange)="onOrderChange($event)"-> track order you will get array of ids, in a new order on each drag and drop, when using several app cards in one component, of course separate methods should be called, i mean this one -> onOrderChange(), same with onItemRemoved()

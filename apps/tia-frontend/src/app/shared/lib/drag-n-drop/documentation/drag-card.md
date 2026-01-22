documentation of whole draggable container

USAGE example

     <app-drag-card
        [items]="items"
        (itemsChange)="items = $event"
        (itemRemoved)="onItemRemoved($event)"
          layout="grid"
        [columns]="3"

/>

REQUIRED:
 [items] ->Card data object containing title and subtitle to display. (Data which will be displayed)
{
title: -> title
subtitle: -> subtitle
}

(itemsChange)="items = $event"   ->  is a MUST for parent to know how to update elements

   
INPUTS
[canDelete] -> true or false (you want removable card or not) false by default

for layout change 
layout = grid / list
in case of grid 
[columns]="3" (how many you want)



OUTPUTS
(itemRemoved)="onItemRemoved($event)" -> remove
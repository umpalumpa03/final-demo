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
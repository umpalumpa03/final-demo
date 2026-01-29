# Scroll Area Component

A container component that provides scrollable content areas with configurable direction.

## Import

```typescript
import { ScrollArea } from '@shared/lib/layout/components/scroll-area/container/scroll-area';
```

## Inputs

- `direction` - `'horizontal' | 'vertical'` - Scroll direction (default: `'vertical'`)
- `height` - `string` - Container height (default: `'20rem'`)
- `scrollbar` - `'visible' | 'hidden'` - Scrollbar visibility (default: `'visible'`)
- `isLoading` - `boolean` - Indicates if content is loading (default: `false`), used to prevent multiple scroll events
- `threshold` - `number` - Distance in pixels from the bottom to trigger the scroll

# Outputs

- `scrollBottom` - Emitted when the user scrolls near the bottom of the content.

## Usage Examples

```html
<!-- Vertical scroll (default) -->
<app-scroll-area>
  <p>Content 1</p>
  <p>Content 2</p>
  <p>Content 3</p>
  <p>Content 4</p>
</app-scroll-area>

<!-- Vertical scroll with custom height -->
<app-scroll-area height="30rem">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</app-scroll-area>

<!-- Horizontal scroll -->
<app-scroll-area direction="horizontal" height="10rem">
  <span>Card 1</span>
  <span>Card 2</span>
  <span>Card 3</span>
  <span>Card 4</span>
</app-scroll-area>
```

## Selector

```
app-scroll-area
```

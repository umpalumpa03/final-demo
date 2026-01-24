# Flex Layout Component

A reusable wrapper component that provides configurable flexbox layouts.

## Import

```typescript
import { FlexLayout } from '@shared/lib/layout/components/flex-layout/container/flex-layout';
```

## Inputs

- `variant` - `'space-between' | 'center' | 'flex-wrap'` - Defines the flex layout behavior
- `gap` - `string` - Sets the gap between flex items (e.g., `'1rem'`, `'2rem'`)

## Variant Options

- `space-between` - applies `justify-content: space-between`
- `center` - applies `justify-content: center`
- `flex-wrap` - applies `flex-wrap: wrap`

## Usage Examples

```html
<!-- Space between -->
<app-flex-layout variant="space-between">
  <span>Left</span>
  <span>Right</span>
</app-flex-layout>

<!-- Center -->
<app-flex-layout variant="center">
  <button>Centered</button>
</app-flex-layout>

<!-- Flex wrap -->
<app-flex-layout variant="flex-wrap">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</app-flex-layout>

<!-- With gap -->
<app-flex-layout variant="space-between" gap="1rem">
  <span>Item 1</span>
  <span>Item 2</span>
</app-flex-layout>

<!-- Flex wrap with gap -->
<app-flex-layout variant="flex-wrap" gap="2rem">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</app-flex-layout>
```

## Selector

```
app-flex-layout
```

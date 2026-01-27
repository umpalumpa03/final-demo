# Flex Layout Component

A reusable wrapper component that provides configurable flexbox layouts.

## Import

```typescript
import { FlexLayout } from '@shared/lib/layout/components/flex-layout/container/flex-layout';
```

## Inputs

- `variant` - `'space-between' | 'center'` - Defines the justify-content behavior
- `wrap` - `boolean` - Enables flex-wrap (default: `false`)
- `gap` - `string` - Sets the gap between flex items (e.g., `'1rem'`, `'16px'`)
- `border` - `boolean` - Enables border around the flex container (default: `false`)
- `direction` - `'row' | 'column'` - Sets the flex direction (default: `'row'`)

## Variant Options

- `space-between` - applies `justify-content: space-between`
- `center` - applies `justify-content: center`

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

<!-- Wrap only -->
<app-flex-layout [wrap]="true">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</app-flex-layout>

<!-- Center + Wrap (combination) -->
<app-flex-layout variant="center" [wrap]="true">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</app-flex-layout>

<!-- Space-between + Wrap + Gap -->
<app-flex-layout variant="space-between" [wrap]="true" gap="1rem">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</app-flex-layout>
```

## Selector

```
app-flex-layout
```

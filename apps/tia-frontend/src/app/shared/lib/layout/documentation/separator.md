# Separator Component Documentation

A highly customizable, accessible horizontal or vertical divider built for **Angular 21**.

## Features
* **Dual Orientation:** Supports both `horizontal` and `vertical` layouts.
* **Signal-based:** Built with Angular Signals for high-performance reactivity.
* **Label Support:** Optional text label with automatic line splitting.
* **Theming:** Fully customizable color, thickness, and spacing via inputs.
* **WAI-ARIA Compliant:** Uses semantic roles for screen reader accessibility.

---

## Installation

Import the component into your standalone component or module:

```typescript
import { SeparatorComponent } from './components/separator/separator.component';

@Component({
  standalone: true,
  imports: [SeparatorComponent],
  templateUrl: './your-page.component.html'
})
export class YourPageComponent {}
```


## Usage

1. Basic Horizontal Line
The default state is a simple horizontal line with 1rem margin.

```html
<app-separator />
```

2. Horizontal with Text Label
When a label is provided, the line automatically splits to frame the text.

```html
<app-separator label="OR" color="#64748b" thickness="2px" />
```

3. Vertical Separator
Used to separate items in flex containers (like navbars or toolbars). Note: Ensure the parent container has a height or uses display: flex.

```html
<!-- make sure that parent element has height otherwise vertical separator won't be visible -->
<div style="display: flex; align-items: center; height: 40px;"> 
  <button>Edit</button>
  <app-separator orientation="vertical" margin="12px" />
  <button>Delete</button>
</div>
```
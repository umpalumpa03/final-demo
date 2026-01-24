# Accordion Component Documentation

A highly flexible, accessible, and performant Accordion system built with **Angular 21**.

## Features
* **Signal-based:** Built with the latest Angular reactivity model for high performance.
* **Two-Way Binding:** Supports `[(isOpen)]` using the `model()` signal.
* **Smooth Animations:** Uses CSS Grid transitions (avoids expensive JS height calculations).
* **Smart Coordination:** Supports "Single Open" (Accordion mode) or "Multi Open" (Expansion Panel mode).
* **WAI-ARIA Compliant:** Fully accessible with correct keyboard roles and attributes.

---

## Installation

Ensure both components are imported into your parent component or module:

```typescript
import { AccordionComponent } from './components/accordion/accordion.component';
import { AccordionItemComponent } from './components/accordion-item/accordion-item.component';

@Component({
  standalone: true,
  imports: [AccordionComponent, AccordionItemComponent],
  templateUrl: './your-page.component.html'
})
export class YourPageComponent {}
```
## Usage

1. Basic Accordion (Single Open)
By default, opening one item will automatically close all others.

```html

<app-accordion>
  <app-accordion-item title="Section 1">
    <p>This is the content for section 1.</p>
  </app-accordion-item>

  <app-accordion-item title="Section 2">
    <p>This is the content for section 2.</p>
  </app-accordion-item>
</app-accordion>
```
2. Multi-Open Mode
Allow multiple panels to be expanded simultaneously by setting the multi input to true.

```html
<app-accordion [multi]="true">
  <app-accordion-item title="Always Open" [isOpen]="true">
    <p>I start open and won't close when you click others.</p>
  </app-accordion-item>
  
  <app-accordion-item title="Secondary Info">
    <p>More details here.</p>
  </app-accordion-item>
</app-accordion>
```

3. Two-Way State Binding
If the parent component needs to react to or control the state of a specific item, use the "Banana-in-a-box" syntax:

```html
<app-accordion-item [(isOpen)]="isPanelExpanded" title="Account Details">
  <p>Sensitive user information...</p>
</app-accordion-item>
```
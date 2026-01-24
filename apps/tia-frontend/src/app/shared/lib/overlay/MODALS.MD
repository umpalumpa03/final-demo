# Angular UI Modal Library

This document provides an overview of the **standalone modal and overlay components** available in the Angular UI Modal Library. All components are built with **Angular v21**, leverage **signals**, and use **OnPush change detection** for maximum performance and predictability.

---

## Components Overview

| Component            | Description                   | Placement                   |
| -------------------- | ----------------------------- | --------------------------- |
| **UiModal**          | Standard centered dialog      | Screen Center               |
| **UiSheetModal**     | Side-panel overlay            | Left / Right / Top / Bottom |
| **UiDrawer**         | Mobile-focused bottom sheet   | Bottom                      |
| **UiContext**        | Coordinate-based context menu | Dynamic (X, Y)              |
| **UiCommandPalette** | Searchable command interface  | Screen Center / Top         |

---

## 1. UiModal

A standard centered dialog designed for focused user interactions.

**Selector**

```
app-ui-modal
```

### Inputs

* **isOpen**: `boolean` (required)
  Controls the modal visibility.

### Outputs

* **closed**: `void`
  Emitted on backdrop click, close button click, or when the `Escape` key is pressed.

### Usage

```html
<app-ui-modal [isOpen]="active" (closed)="active = false">
  <p>Modal Content</p>
</app-ui-modal>
```

---

## 2. UiSheetModal

A versatile panel that slides in from the edges of the viewport.

**Selector**

```
app-ui-sheet-modal
```

### Inputs

* **isOpen**: `boolean` (required)
  Controls visibility.
* **direction**: `'left' | 'right' | 'top' | 'bottom'` (default: `'right'`)
  Defines the side from which the panel enters.

### Outputs

* **closed**: `void`
  Emitted on backdrop click, close button click, or `Escape` key press.

### Usage

```html
<app-ui-sheet-modal
  [isOpen]="showSheet"
  direction="left"
  (closed)="showSheet = false">
  <nav>Navigation Content</nav>
</app-ui-sheet-modal>
```

---

## 3. UiDrawer

A slide-up container optimized for mobile navigation and action sheets.

**Selector**

```
app-ui-drawer
```

### Inputs

* **isOpen**: `boolean`
  Controls visibility.

### Outputs

* **closed**: `void`
  Emitted on backdrop click or when the `Escape` key is pressed.

### Usage

```html
<app-ui-drawer [isOpen]="isMenuOpen" (closed)="isMenuOpen = false">
  <ul>
    <li>Option 1</li>
    <li>Option 2</li>
  </ul>
</app-ui-drawer>
```

---

## 4. UiContext

A context menu that appears at specific screen coordinates, commonly used for right-click interactions.

**Selector**

```
app-ui-context
```

### Inputs

* **position**: `{ x: number; y: number }` (required)
  Screen coordinates where the menu should appear.
* **items**: `(ContextMenuItem | 'divider')[]` (required)
  Array of menu items or dividers.

### Outputs

* **itemClick**: `string`
  Emits the action identifier of the clicked item.
* **menuClose**: `void`
  Emitted on backdrop click, scroll, or window resize.

### Usage

```html
<app-ui-context
  [position]="{ x: 200, y: 400 }"
  [items]="myItems"
  (itemClick)="handleAction($event)"
  (menuClose)="closeMenu()">
</app-ui-context>
```

---

## 5. UiCommandPalette

A searchable command interface with keyboard navigation support.

**Selector**

```
app-ui-command-palette
```

### Inputs

* **actions**: `CommandAction[]` (required)
  List of searchable command actions.
* **config**: `{ placeholder?: string }`
  Configuration object for customizing the search input placeholder.

### Outputs

* **actionSelected**: `CommandAction`
  Emits the selected action object.
* **menuClose**: `void`
  Emitted when the `Escape` key is pressed.

### Usage

```html
<app-ui-command-palette
  [actions]="commands"
  (actionSelected)="execute($event)"
  (menuClose)="closePalette()">
</app-ui-command-palette>
```

---

## Global Styling Requirements

The library relies on **CSS variables** to ensure consistent theming across all components. These variables must be defined in your global stylesheet.

```css
:root {
  --color-bg: #ffffff;
  --color-fg: #000000;
  --color-accent: #e5e7eb;
  --color-muted: #9ca3af;
  --color-primary: #3b82f6;
  --color-danger: #ef4444;
}
```

---

## Required SVG Assets

Ensure the following SVG assets are available at the specified paths:

* **Context Menu Icons**
  `images/svg/context/[icon-name].svg`

* **Command Palette Icons**
  `/images/svg/command-palette/[icon-name].svg`

---

## Notes

* All components are **standalone** and can be imported directly.
* Built with **signals-first architecture**.
* Uses **OnPush change detection** for optimal performance.

---

# Palettes Documentation

## Overview

Centralized theming system providing consistent color schemes across the UI.

## Core Components

### Palettes

**Path:** `src/app/shared/lib/palettes/`  
Displays color swatches for all available themes.

**Usage**

```html
<app-palettes [theme]="'oceanblue'"></app-palettes>
```

### Color Application

Demonstrates real UI usage of theme colors (cards, headers, content).

**Path:** src/app/shared/lib/palettes/color-application/

### Notes

Highlights theming principles and visual hierarchy.

**Path:** src/app/shared/lib/palettes/notes/

### Admin Color Palettes

**Path:** src/app/features/admin/components/library/components/colorpalettes/

## Available Themes

- Ocean Blue (#0284c7)

- Royal Blue (#2563EB)

- Deep Blue (#1E40AF)

## Theme Structure

Each theme includes:

- Primary
- Secondary
- Accent
- Muted
- Background
- Foreground

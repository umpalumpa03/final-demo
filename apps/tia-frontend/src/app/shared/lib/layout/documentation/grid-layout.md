
# Example Usage

## app-grid-layout takes two optional inputs: `cols` and `gap`.
- `cols`: Defines the number of columns in the grid. It can take values like '1', '2', '3', '4', '2-1', '1-2' to create different layouts.
- `gap`: Defines the gap between grid items. It accepts any valid CSS size value (e.g., '10px', '1rem', '5%').

```html
    <app-grid-layout cols="2-1" gap="20px">
        
        <app-grid-item>
            <div class="card">Main Content (66%)</div>
        </app-grid-item>
        
        <app-grid-item>
            <div class="card">Sidebar (33%)</div>
        </app-grid-item>

    </app-grid-layout>

    <app-grid-layout [cols]="4">
        <app-grid-item>1</app-grid-item>
        <app-grid-item>2</app-grid-item>
        <app-grid-item>3</app-grid-item>
        <app-grid-item>4</app-grid-item>
    </app-grid-layout>
```
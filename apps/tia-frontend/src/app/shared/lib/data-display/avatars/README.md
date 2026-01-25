## ავატარი

### რას აკეთებს
გამოაჩენს მომხმარებლის ინიციალებს, ზომის, ფერის, ტონისა და სტატუსის არჩევითი მაჩვენებლით.

### როგორ მუშაობს
- მიანიჭებს CSS კლასებს `size`, `tone` და `color` მნიშვნელობებიდან გამომდინარე.
- სტატუსის წერტილს გამოჩნდება მხოლოდ მაშინ, როცა `status` მითითებულია.

### შეყვანები
- `size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` (optional, default: `md`)
- `initials: string`
- `tone: 'soft' | 'solid'` (optional, default: `soft`)
- `color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray'` (optional, default: `blue`)
- `status: 'online' | 'away' | 'busy' | 'offline' | null` (optional)

### გამოყენება
```html
<app-avatar
  [initials]="'JD'"
  size="sm"
  tone="solid"
  color="purple"
  [status]="'online'"
></app-avatar>
```

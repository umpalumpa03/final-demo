## Tooltip

### რას აკეთებს
ტრიგერზე ჰოვერისას აჩვენებს მცირე ტექსტურ მინიშნებას.

### როგორ მუშაობს
- ტრიგერისთვის იყენებს `ng-content`.
- მაუსის შეყვანაზე აჩვენებს მინიშნებას, ხოლო დატოვებაზე მალავს.
- `placement` მიხედვით სვამს შესაბამის სტილს.

### შეყვანები
- `content: string` (required)
- `placement: 'top' | 'bottom' | 'left' | 'right'` (optional, default: `top`)

### გამოყენება
```html
<app-tooltip [content]="'Copied!'" placement="top">
  <button type="button">Copy link</button>
</app-tooltip>
```

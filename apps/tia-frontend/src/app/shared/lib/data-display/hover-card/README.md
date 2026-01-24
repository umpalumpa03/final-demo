## ჰოვერ ბარათი

### რას აკეთებს
ჰოვერზე ტრიგერდება და აჩენს ინფოს რამე ქარდზე მაუსის მიტანისას

### როგორ მუშაობს
- იყენებს `hover-card-trigger` და `hover-card-content`.
- მაუსის მიტანაზე იხსნება, ხოლო დატოვებაზე იკეტება.
- `placement` მიხედვით სვამს შესაბამის სტილს.

### შეყვანები
- `placement: 'top' | 'bottom' | 'left' | 'right'` (optional, default: `top`)

### გამოყენება
```html
<app-hover-card placement="right">
  <button type="button" hover-card-trigger>Profile</button>
  <div hover-card-content>
    <strong>Sam Rivera</strong>
    <p>Customer Success</p>
  </div>
</app-hover-card>
```

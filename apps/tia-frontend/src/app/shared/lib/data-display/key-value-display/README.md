## key value display

### რას აკეთებს
აჩენს სათაურს და ინფოს სიას.

### როგორ მუშაობს
- რენდერს არჩევით სათაურს.
- გადის `items` სიაზე და აჩვენებს თითოეულ ეტიკეტსა და მნიშვნელობას.
- თუ `valueType` არის `badge`, ბეიჯი რენდერდება `badgeTone` სტილით.

### შეყვანები
- `title: string` (optional)
- `items: KeyValueDisplayItem[]`

### გამოყენება
```html
<app-key-value-display
  [title]="'User details'"
  [items]="details"
></app-key-value-display>
```

```ts
details = [
  { id: 'email', label: 'Email', value: 'user@example.com' },
  { id: 'role', label: 'Role', value: 'Admin', valueType: 'badge', badgeTone: 'blue' },
];
```

## list display

### რას აკეთებს
აჩენს ადამიანების ბარათების სიას ინიციალებით, სახელით, როლით და არჩევითი ბეიჯით.
ჩართვისას, ბარათები დაკლიკებისას აბრუნებს არჩეულ ელემენტს.

### როგორ მუშაობს
- გადის `items` სიაზე და რენდერს თითოეულ ბარათს.
- `selectable` true-ის დროს ამატებს ინტერაქტიულ სტილს.
- არჩეულ ელემენტს აბრუნებს `selected`-ით.

### შეყვანები/გამოტანები
- `items: ListDisplayItem[]` (input)
- `selectable: boolean` (input)
- `selected: EventEmitter<ListDisplayItem>` (output)

### გამოყენება
```html
<app-list-display
  [items]="team"
  [selectable]="true"
  (selected)="onMemberSelected($event)"
></app-list-display>
```

```ts
team = [
  {
    id: 'vera',
    initials: 'VL',
    name: 'Vera Lewis',
    role: 'Design Lead',
    statusTone: 'green',
    badge: { label: 'Active', tone: 'blue' },
  },
];
```

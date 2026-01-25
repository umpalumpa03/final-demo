## aspect-ratio

### რას აკეთებს
აჩენს ასპექტის თანაფარდობის ბარათების სიას და ბარათზე დაკლიკისას აბრუნებს არჩეულ ელემენტს. თითოეული ბარათი ზომას აკონტროლებს `ratio` და `width` ველებით.

### როგორ მუშაობს
- შაბლონი გადის `items` სიაზე.
- თითოეულ ბარათზე იბმება `aspect-ratio` და CSS-ის custom width.
- დაკლიკებისას ელემენტი იგზავნება `selected`-ით.

### გადასაცემია
- `items: AspectRatioItem[]` (input)
- `selected: EventEmitter<AspectRatioItem>` (output) - ეს ჯერ არაფერს აკეთებს უბრალოდ დატოვებული მაქვს რო ვინიცობაა და დამჭირდეს რო უცებ მივაბა დამატებითი ლოგიკა

### გამოყენება
```html
<app-aspect-ratio-list
  [items]="ratios"
  (selected)="onRatioSelected($event)"
></app-aspect-ratio-list>
```

```ts
ratios = [
  {
    id: 'video',
    label: '16:9',
    description: 'Video',
    ratio: '16 / 9',
    width: '44.8rem',
    background: 'var(--color-secondary)',
  },
];
```

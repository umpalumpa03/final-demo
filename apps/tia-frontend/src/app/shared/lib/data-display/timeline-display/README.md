## ქრონოლოგიის ჩვენება

### რას აკეთებს
აჩენს ვერტიკალურ ქრონოლოგიას ფერადი წერტილით, სათაურით, დროის ნიშნით და არჩევითი დეტალით.

### როგორ მუშაობს
- გადის `items` სიაზე და არენდერებს წერტილსა და შემაერთებელ ხაზს.
- ბოლო ელემენტისთვის მალავს შემაერთებელ ხაზს.
- წერტილზე იყენებს tone-ის შესაბამის სტილს.

### გადაეცემა
- `items: TimelineDisplayItem[]`

### გამოყენება
```html
<app-timeline-display [items]="events"></app-timeline-display>
```

```ts
events = [
  {
    id: 'start',
    title: 'Application received',
    timestamp: '09:12 AM',
    detail: 'Document verification started',
    tone: 'blue',
  },
  {
    id: 'review',
    title: 'Under review',
    timestamp: '09:40 AM',
    tone: 'green',
  },
];
```

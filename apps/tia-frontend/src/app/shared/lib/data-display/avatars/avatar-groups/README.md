## ავატარების ჯგუფი

### რას აკეთებს
აჩენს ავატარების რიგს არჩევითი გადაფარვით და "+N" ზედმეტი რაოდენობის მაჩვენებლით.

### როგორ მუშაობს
- `avatars` სიიდან არენდერებს მაქსიმუმ `max` რაოდენობის ავატარს.
- დანარჩენებისთვის ითვლის ზედმეტი რაოდენობის მნიშვნელობას.
- "+N" ავატარისთვის იყენებს `overflowTone` და `overflowColor` მნიშვნელობებს.

### გადაეცემა
- `avatars: AvatarGroupItem[]`
- `size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` (optional, default: `md`)
- `max: number` (optional, default: `4`)
- `overflowTone: 'soft' | 'solid'` (optional, default: `soft`)
- `overflowColor: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray'` (optional, default: `gray`)

### გამოყენება
```html
<app-avatar-group
  [avatars]="members"
  [max]="3"
  size="sm"
></app-avatar-group>
```

```ts
members = [
  { initials: 'AL', color: 'blue' },
  { initials: 'BN', color: 'green', status: 'online' },
  { initials: 'CR', color: 'purple' },
  { initials: 'DS', color: 'orange' },
];
```

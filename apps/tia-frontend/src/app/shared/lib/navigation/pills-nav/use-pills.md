<!-- <app-pills-nav> -->

ეს კომპონენტი დაგეხმარებათ თქვენთან გარკვეული დატის მოსაფილტრად

### გამოყენების მაგალითი:

```html
<app-pills-nav
  [pills]="pillsData()"
  [initialSelectedId]="'all'"
  (pillSelected)="onPillSelected($event)"
>
</app-pills-nav>
```

- `[pills]` - ში ვაწვდით ერეიდ იმ დატას, რის მიხედვითაც გვინდა მოფილტვრა,
- `[initialSelectedId]` - თქვენი დატიდან შეგიძლიათ ჩააწოდოთ ნებისმიერი აიდი რომ დეფოლტად მიიღოს ეგ მნიშვნელობა

---

### დატის მაგალითი:

გადავცემთ აიდის და ლეიბლს სტრინგად

```typescript
export const PILLARRAY: PillItem[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'archived', label: 'Archived' }
] as const;
```

ts-ის მხარეს მოგვაქვს ეს ერეი სიგნალად:

```typescript
public readonly pillsData = signal<PillItem[]>(PILLARRAY);
```

ასევე დაგჭირდებათ სიგნალი მოსელექთებული აითემისთვის

```typescript
public readonly selectedPill = signal<PillItem | null>(null);
```

რომელსაც გაატანთ მეთოდს შემდეგნაირად:

```typescript
public onPillSelected(pill: PillItem): void {
  this.selectedPill.set(pill);
}
```

---

ეს არის საჩვენებელი მაგალითი თუ როგორ შეიძლება გამოიყენოთ PillsNav კომპონენტი ფილტრაციისთვის.

```typescript
public readonly items = signal<Item[]>(ITEMS);

public readonly filteredItems = computed(() => {
  const pill = this.selectedPill();
  if (!pill || pill.id === 'all') {
    return this.items();
  }
  return this.items().filter(item => item.status === pill.id);
});
```
ეს არის გაფილტრული აითემების სია app-pills-nav კომპონენტის გამოყენებით


```html

@for(item of filteredItems(); track item.id) {
  <div>
    <h4>{{ item.name }}</h4>
  </div>
}

```

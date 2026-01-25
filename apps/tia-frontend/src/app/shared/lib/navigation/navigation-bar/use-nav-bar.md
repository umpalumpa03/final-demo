<!-- <app-navigation-bar> -->

## 1. თემფლეითში გამოყენება

გვაქვს ორი ვარიანტი, ჰორიქონტალური და ვერტიკალური ბარი

### ვერტიკალური:

```html
<app-navigation-bar
  [items]="verticalItems()"
  [orientation]="'vertical'"
  [activeItem]="activeVertical()"
>
</app-navigation-bar>
```

### ჰორიზონტალური:

```html
<app-navigation-bar
  [items]="horizontalItems()"
  [orientation]="'horizontal'"
  [activeItem]="activeHorizontal()"
>
</app-navigation-bar>
```

- `[orientation]` - გადაეცემა რომელი ტიპი გსურთ
- `[items]` - გადავცემთ ერეის ნავიგაციების სახელებით და როუტებით. გვაქვს აიქონის ჩამატების ოფშენიც, რომელიც დატას უნდა გავაყოპლოტ:

#### დატის მაგალითი:

```typescript
export const VERTICALNAVBARS: NavigationItem[] = [
  {
    label: 'Home',
    icon: 'images/svg/notification-icons/home-gray.svg',
    route: '/admin/library/navigation'
  },
  {
    label: 'Search',
    icon: 'images/svg/notification-icons/search.svg',
    route: 'test'
  }
] as const;
```

თუ აიქონი არ გინდათ, უბრალოდ არ გაატანოთ

- `[activeItem]` - აქ გადაეცით სტრინგი, რომელიც იქნება არსებული ფეიჯის როუტის სახელი, ამას აქვს განსხვავებული სტილი.

დატას შეგიძლიათ გაატანოთ disabled: true რომ არსებული  აითემი იყოს დისეიბლი
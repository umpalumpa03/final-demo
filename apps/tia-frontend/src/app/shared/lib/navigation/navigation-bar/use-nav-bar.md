<!-- <app-navigation-bar> -->

## 1. თემფლეითში გამოყენება

გვაქვს ორი ვარიანტი, ჰორიქონტალური და ვერტიკალური ბარი

### ვერტიკალური:

```html
<app-navigation-bar
  [items]="verticalItems()"
  [orientation]="'vertical'"
>
</app-navigation-bar>
```

### ჰორიზონტალური:

```html
<app-navigation-bar
  [items]="horizontalItems()"
  [orientation]="'horizontal'"
>
</app-navigation-bar>
```

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
    count:0
  }
] as const;
```

თუ აიქონი არ გინდათ, უბრალოდ არ გაატანოთ

- count:0 არის ოფშენალი, თუ გჭირდებათ ნავიგაციაში, გაატანეთ თავიდან 0 და მერე დააფდეითეთ ბექიდან მიღებული ინფოთი

დატას შეგიძლიათ გაატანოთ disabled: true რომ არსებული  აითემი იყოს დისეიბლი
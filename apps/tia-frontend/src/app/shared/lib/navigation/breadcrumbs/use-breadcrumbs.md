<!-- <app-breadcrumbs> -->

## 1. თემფლეითში გამოყენება

```html
<app-breadcrumbs [breadcrumbs]="breadcrumbs()"></app-breadcrumbs>
```

- `[breadcrumbs]` - ერეიდ გადავცემთ დატას.

დატა გამოიყურება შემდეგნაირად:

```typescript
export const BREADCRUMBS2: Breadcrumb[] = [
  { label: 'Account', icon: 'images/svg/notification-icons/home.svg', route: '/admin/library/navigation' },
  { label: 'Notifications', route: 'test' },
  { label: 'Preferences', route: '' },
] as const;
```

ვაწვდით ლეიბლს, სახელისთვის, სასურველ როუტს და თუ საჭირო გახდა აიქონსაც.
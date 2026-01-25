<!-- <app-tabs> -->

## 1. თემფლეითში გამოყენება

```html
<app-tabs [tabs]="tabs()" [orientation]="'horizontal'"></app-tabs>
```

- `[orientation]` - ში ვუწერთ ჰორიზონტალური ტაბი გვინდა თუ ვერტიკალური.  
  სულ ორი ოფშენია: `horizontal`, `vertical`

- `[tabs]` - აქ უნდა გადავაწოდოთ ერეიდ დატა. დატა გამოიყურება ასე:

### აიქონის გარეშე:

```typescript
export const TABS: TabItem[] = [
  { label: 'Overview', route: '/admin/library/navigation' },
  { label: 'Analytics', route: 'test' },
  { label: 'Reports', route: 'reports' },
  { label: 'Settings', route: '' }
] as const;  
```

### აიქონით:

```typescript
export const TABS2: TabItem[] = [
  { label: 'Account', icon: 'images/svg/notification-icons/account.svg', route: '/admin/library/navigation' },
  { label: 'Notifications', icon: 'images/svg/notification-icons/notifications.svg', route: 'test' },
  { label: 'Preferences', icon: 'images/svg/notification-icons/setting.svg', route: '' },
] as const;
```

---

ts-ის მხარეს რაც დაგჭირდებათ არის ის, რომ სიგნალად მიიღოთ ეს ერეი და მერე წაიღოთ თემფლეითში

**example:**
```typescript
public readonly tabs = signal(TABS);
public readonly tabs2 = signal(TABS2);
```

html-მხარე ზემოთ არის მოცემული.
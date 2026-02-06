# Lazy Translation Loading

## Usage examples

### 1. Route Resolver

Load translations before route activation:

```typescript
import { translationResolver } from '@tia/core/i18n';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: {
      translations: translationResolver(['dashboard', 'my-finances']),
    },
  },
  {
    path: 'loans',
    component: LoansComponent,
    resolve: {
      translations: translationResolver('loans'),
    },
  },
];
```

### 2. Component-Level Loading

Load translations in component initialization:

```typescript
import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslationLoaderService } from '@tia/core/i18n';

@Component({
  selector: 'app-dashboard',
  template: `...`,
})
export class DashboardComponent implements OnInit {
  private translationLoader = inject(TranslationLoaderService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.translationLoader.loadTranslations(['dashboard', 'my-finances']).pipe(
        takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
```

### 3. Preloading Multiple Modules

Preload translations for better UX:

```typescript
this.translationLoader.preloadModules(['loans', 'transactions', 'transfers']).pipe(
    takeUntilDestroyed(this.destroyRef)
).subscribe();
```

### 4. Check if Module Loaded

```typescript
const isLoaded = this.translationLoader.isModuleLoaded('dashboard');
```
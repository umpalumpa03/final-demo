import { computed, Directive, input } from '@angular/core';

@Directive()
export abstract class BaseWidget {
  public readonly isLarge = input(false);

  public readonly widgetHeight = computed(() =>
    this.isLarge() ? '35rem' : '35rem',
  );
}

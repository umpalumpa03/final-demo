import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiModal {
  private readonly targets = signal<Map<string, HTMLElement>>(new Map());
  public readonly activeStepId = signal<string | null>(null);

  public readonly activeTarget = computed(() => {
    const id = this.activeStepId();
    return id ? (this.targets().get(id) ?? null) : null;
  });

  public register(id: string, el: HTMLElement) {
    this.targets.update((map) => new Map(map).set(id, el));
  }

  public unregister(id: string) {
    this.targets.update((map) => {
      const next = new Map(map);
      next.delete(id);
      return next;
    });
  }
}

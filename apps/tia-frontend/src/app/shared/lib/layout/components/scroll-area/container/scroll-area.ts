import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

import { TDirection } from './scroll-area.model';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';

@Component({
  selector: 'app-scroll-area',
  imports: [ErrorStates],
  templateUrl: './scroll-area.html',
  styleUrl: './scroll-area.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollArea {
  public readonly direction = input<TDirection>('vertical');
  public readonly height = input<string>('20rem');
  public readonly scrollbar = input<'visible' | 'hidden'>('visible');
  public readonly hideBorder = input<boolean>(false);
  public readonly isLoading = input<boolean>(false);
  public readonly isError = input<boolean>(false);
  public readonly threshold = input<number>(20);
  public scrollBottom = output<void>();
  public retry = output<void>();

  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');

  public readonly isHorizontal = computed(
    () => this.direction() === 'horizontal',
  );
  public readonly isVertical = computed(() => this.direction() === 'vertical');
  public readonly isScrollbarVisible = computed(
    () => this.scrollbar() === 'visible',
  );

  private hasEmittedForCurrentState = false;

  constructor() {
    effect(() => {
      const el = this.viewport()?.nativeElement;
      const isLoading = this.isLoading();

      if (isLoading) {
        this.hasEmittedForCurrentState = false;
        return;
      }

      setTimeout(() => {
        if (el && !isLoading && !this.hasEmittedForCurrentState) {
          const isNotScrollable = el.scrollHeight <= el.clientHeight;

          if (isNotScrollable) {
            this.hasEmittedForCurrentState = true;
            this.scrollBottom.emit();
          }
        }
      }, 0);
    });
  }

  public onButtonClick(): void {
    this.retry.emit();
  }

  public onScroll(): void {
    const el = this.viewport()?.nativeElement;
    if (el && !this.isLoading()) {
      this.hasEmittedForCurrentState = false;
      this.checkScrollPosition(el);
    }
  }

  private checkScrollPosition(el: HTMLElement): void {
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (distanceToBottom <= this.threshold()) {
      this.scrollBottom.emit();
    }
  }
}

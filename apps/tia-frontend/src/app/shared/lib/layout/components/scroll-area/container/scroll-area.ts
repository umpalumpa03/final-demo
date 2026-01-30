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
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';

@Component({
  selector: 'app-scroll-area',
  imports: [Spinner, ErrorStates],
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

  constructor() {
    effect(() => {
      const el = this.viewport()?.nativeElement;
      if (el!.scrollHeight == 0 && !this.isLoading()) {
        this.checkScrollPosition(el!);
      }
    });
  }

  public onButtonClick(): void {
    this.retry.emit();
  }

  public onScroll(): void {
    const el = this.viewport()?.nativeElement;
    if (el && !this.isLoading()) {
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

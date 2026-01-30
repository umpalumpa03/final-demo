import {
  Directive,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  input,
  output,
} from '@angular/core';

@Directive({
  selector: '[appVisibleInViewport]',
  standalone: true,
})
export class VisibleInViewportDirective implements AfterViewInit, OnDestroy {
  // Inputs
  public appVisibleInViewport = input.required<string>();
  public isRead = input<boolean>(false);

  // Output
  public becameVisible = output<string>();

  private observer: IntersectionObserver | null = null;
  private hasEmitted = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    if (this.isRead()) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasEmitted && !this.isRead()) {
            this.hasEmitted = true;
            this.becameVisible.emit(this.appVisibleInViewport());

            this.observer?.unobserve(this.el.nativeElement);
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

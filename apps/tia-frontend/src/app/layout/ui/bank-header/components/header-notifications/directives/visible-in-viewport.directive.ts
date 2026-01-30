import {
  Directive,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  input,
  output,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appVisibleInViewport]',
  standalone: true,
})
export class VisibleInViewportDirective implements AfterViewInit, OnDestroy {
  public appVisibleInViewport = input.required<string>();
  public isRead = input<boolean>(false);

  public becameVisible = output<string>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private hasEmitted = false;

  ngAfterViewInit(): void {
    if (this.isRead()) return;

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.hasEmitted && !this.isRead()) {
        this.hasEmitted = true;
        this.becameVisible.emit(this.appVisibleInViewport());
        this.observer?.disconnect();
      }
    });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

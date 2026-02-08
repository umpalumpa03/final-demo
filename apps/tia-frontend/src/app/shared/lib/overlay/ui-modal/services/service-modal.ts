import {
  DOCUMENT,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  calculateModalPositions,
  ModalPlacement,
  toggleBodyScroll,
} from '../config/ui-modal.config';
import { ModalOffset } from '../models/modal-positions.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ModalResponsiveService {
  // DI ragaceebi
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  // lokaluri state
  public readonly spotlightStyle = signal<Record<string, string>>({});
  public readonly cardStyle = signal<Record<string, string>>({});
  public readonly isFallback = signal<boolean>(false);

  private observer: ResizeObserver | null = null;
  private rafId: number | null = null;

  // trackingis metodebi
  public startTracking(
    target: HTMLElement | string,
    padding: number,
    gap: number,
    placement: ModalPlacement,
    offset: ModalOffset,
  ): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stopTracking();

    const find = () => {
      const el =
        typeof target === 'string'
          ? this.document.getElementById(target)
          : target;

      if (el && el.offsetParent !== null && this.document.body.contains(el)) {
        this.updatePosition(el, padding, gap, placement, offset);
      } else {
        this.updatePosition(null, padding, gap, placement, offset);
        this.rafId = requestAnimationFrame(find);
      }
    };
    find();
  }

  public updatePosition(
    el: HTMLElement | null,
    padding: number,
    gap: number,
    placement: ModalPlacement,
    offset: ModalOffset,
  ): void {
    const { spotlightStyle, cardStyle, isFallback } = calculateModalPositions(
      el,
      padding,
      gap,
      placement,
      offset,
    );

    this.isFallback.set(isFallback);

    if (isFallback) {
      this.spotlightStyle.set({} as Record<string, string>);
      this.cardStyle.set({} as Record<string, string>);
      toggleBodyScroll(false);
      this.cleanupObserver();
    } else {
      this.spotlightStyle.set(spotlightStyle as Record<string, string>);
      this.cardStyle.set(cardStyle as Record<string, string>);
      toggleBodyScroll(true);

      if (el && !this.observer) {
        this.initObserver(el, padding, gap, placement, offset);
      }
    }
  }

  private initObserver(
    el: HTMLElement,
    p: number,
    g: number,
    pl: ModalPlacement,
    o: ModalOffset,
  ): void {
    this.observer = new ResizeObserver(() =>
      this.updatePosition(el, p, g, pl, o),
    );
    this.observer.observe(el);
    this.observer.observe(this.document.body);
  }

  public stopTracking(): void {
    toggleBodyScroll(false);
    this.cleanupObserver();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private cleanupObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  ngOnDestroy(): void {
    this.stopTracking();
  }
}

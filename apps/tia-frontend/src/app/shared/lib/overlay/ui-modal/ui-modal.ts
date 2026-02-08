import {
  Component,
  input,
  output,
  HostListener,
  ChangeDetectionStrategy,
  computed,
  DOCUMENT,
  inject,
  effect,
  signal,
  OnDestroy,
} from '@angular/core';
import {
  ModalCardConfig,
  ModalSpotlightConfig,
} from './models/modal-positions.model';
import {
  calculateModalPositions,
  ModalPlacement,
  toggleBodyScroll,
} from './config/ui-modal.config';

@Component({
  selector: 'app-ui-modal',
  templateUrl: './ui-modal.html',
  styleUrls: ['./ui-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiModal implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private observer: ResizeObserver | null = null;
  private rafId: number | null = null;

  public readonly isOpen = input.required<boolean>();
  public readonly closed = output<void>();

  public readonly hasNavigation = input<boolean>(false);
  public readonly navigate = output<number>();
  public readonly hasScroll = input<boolean>(false);
  public readonly hideExit = input<boolean>(false);

  public readonly target = input<HTMLElement | string | null>(null);
  public readonly targetPadding = input<number>(8);
  public readonly targetGap = input<number>(16);

  protected readonly spotlightStyle = signal<Record<string, string>>({});
  protected readonly cardStyle = signal<Record<string, string>>({});
  protected readonly hasTarget = computed(() => !!this.target());

  public readonly placement = input<ModalPlacement>('bottom');

  protected get isTracking(): boolean {
    return !!this.target() && this.isOpen();
  }

  private readonly resolvedTarget = signal<HTMLElement | null>(null);

  constructor() {
    effect(() => {
      const targetInput = this.target();
      if (this.isOpen() && targetInput) {
        this.resolveAndTrack(targetInput);
      } else {
        this.stopTracking();
      }
    });
  }

  private resolveAndTrack(input: HTMLElement | string) {
    const find = () => {
      const el =
        typeof input === 'string' ? this.document.getElementById(input) : input;

      if (el) {
        this.startObserver(el);
      } else {
        this.rafId = requestAnimationFrame(find);
      }
    };
    find();
  }

  private startObserver(el: HTMLElement): void {
    toggleBodyScroll(true);
    this.updatePosition(el);

    this.observer = new ResizeObserver(() => this.updatePosition(el));
    this.observer.observe(el);
    this.observer.observe(this.document.body);
  }

  private updatePosition(el: HTMLElement): void {
    const { spotlightStyle, cardStyle } = calculateModalPositions(
      el,
      this.targetPadding(),
      this.targetGap(),
      this.placement(),
    );

    this.spotlightStyle.set(spotlightStyle);
    this.cardStyle.set(cardStyle);
  }

  private stopTracking(): void {
    toggleBodyScroll(false);

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public close(): void {
    this.closed.emit();
  }

  public onPrev(e: Event): void {
    e.stopPropagation();
    this.navigate.emit(-1);
  }

  public onNext(e: Event): void {
    e.stopPropagation();
    this.navigate.emit(1);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.close();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.isOpen() && this.hasNavigation()) {
      this.navigate.emit(-1);
    }
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.isOpen() && this.hasNavigation()) {
      this.navigate.emit(1);
    }
  }

  ngOnDestroy(): void {
    this.stopTracking();
  }
}

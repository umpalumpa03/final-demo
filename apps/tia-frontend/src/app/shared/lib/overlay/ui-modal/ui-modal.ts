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
  calculateModalPositions,
  ModalPlacement,
  toggleBodyScroll,
} from './config/ui-modal.config';
import { ModalOffset } from './models/modal-positions.model';
import { ModalResponsiveService } from './services/service-modal';

@Component({
  selector: 'app-ui-modal',
  templateUrl: './ui-modal.html',
  styleUrls: ['./ui-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiModal implements OnDestroy {
  protected readonly modalService = inject(ModalResponsiveService);

  public readonly isOpen = input.required<boolean>();
  public readonly closed = output<void>();
  public readonly hasNavigation = input<boolean>(false);
  public readonly navigate = output<number>();
  public readonly hasScroll = input<boolean>(false);
  public readonly hideExit = input<boolean>(false);
  public readonly target = input<HTMLElement | string | null>(null);
  public readonly targetPadding = input<number>(8);
  public readonly targetGap = input<number>(16);
  public readonly placement = input<ModalPlacement>('bottom');
  public readonly offset = input<ModalOffset>({});
  public readonly hasCloseZIndex = input<boolean>();

  protected readonly spotlightStyle = this.modalService.spotlightStyle;
  protected readonly cardStyle = this.modalService.cardStyle;
  protected readonly isFallback = this.modalService.isFallback;
  protected readonly hasTarget = computed(() => !!this.target());

  protected readonly isTutorialActive = computed(() => {
    return this.hasTarget() && !this.isFallback() && this.isOpen();
  });

  constructor() {
    effect(() => {
      const targetInput = this.target();
      if (this.isOpen() && targetInput) {
        this.modalService.startTracking(
          targetInput,
          this.targetPadding(),
          this.targetGap(),
          this.placement(),
          this.offset(),
        );
      } else {
        this.modalService.stopTracking();
      }
    });
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    const t = this.target();
    if (this.isOpen() && t) {
      this.modalService.startTracking(
        t,
        this.targetPadding(),
        this.targetGap(),
        this.placement(),
        this.offset(),
      );
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
    if (this.isOpen() && this.hasNavigation()) this.navigate.emit(-1);
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.isOpen() && this.hasNavigation()) this.navigate.emit(1);
  }

  ngOnDestroy(): void {
    this.modalService.stopTracking();
  }
}

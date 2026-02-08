import {
  Component,
  input,
  output,
  HostListener,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { ModalPosition, SpotlightConfig } from './models/modal-positions.model';

@Component({
  selector: 'app-ui-modal',
  templateUrl: './ui-modal.html',
  styleUrls: ['./ui-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiModal {
  public readonly isOpen = input.required<boolean>();
  public readonly closed = output<void>();

  public readonly hasNavigation = input<boolean>(false);
  public readonly navigate = output<number>();
  public readonly hasScroll = input<boolean>(false);
  public readonly hideExit = input<boolean>(false);

  public readonly spotlight = input<SpotlightConfig | null>(null);
  public cardPosition = input<ModalPosition | null>(null);

  protected spotlightStyle = computed(() => {
    const config = this.spotlight();
    if (!config) return {};

    return {
      top: `${config.top}px`,
      left: `${config.left}px`,
      width: `${config.width}px`,
      height: `${config.height}px`,
    };
  });

  protected cardStyle = computed(() => {
    const pos = this.cardPosition();
    if (!pos) return {};

    return {
      position: 'absolute',
      margin: '0',
      top: pos.top ?? 'auto',
      left: pos.left ?? 'auto',
      right: pos.right ?? 'auto',
      bottom: pos.bottom ?? 'auto',
      transform: pos.transform ?? 'none',
    };
  });

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
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { DRAWER_CONFIG } from './config/drawer.config';

@Component({
  selector: 'app-ui-drawer',
  imports: [],
  templateUrl: './ui-drawer.html',
  styleUrl: './ui-drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDrawer {
  @ViewChild('drawer')
  private drawerElement!: ElementRef<HTMLElement>;
  public isOpen = input<boolean>();
  public closed = output<void>();

  public readonly dragOffset = signal<number>(0);
  public readonly isDragging = signal<boolean>(false);

  public startY = 0;

  constructor() {
    effect(
      () => {
        if (!this.isOpen()) {
          this.resetState();
        }
      },
      { allowSignalWrites: true },
    );
  }

  private resetState(): void {
    this.dragOffset.set(0);
    this.isDragging.set(false);
    this.startY = 0;
  }

  public readonly transformStyle = computed(() => {
    return `translateY(${this.dragOffset()}px)`;
  });

  public onPointerDown(event: PointerEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.ui-drawer__handle-area')) return;

    this.isDragging.set(true);
    this.startY = event.clientY;

    this.drawerElement.nativeElement.style.transition = 'none';
    this.drawerElement.nativeElement.setPointerCapture(event.pointerId);
  }

  public onPointerMove(event: PointerEvent): void {
    if (!this.isDragging()) return;

    const deltaY = event.clientY - this.startY;

    if (deltaY > 0) {
      this.dragOffset.set(deltaY);
    }
  }

  public onPointerUp(): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);

    const drawerHeight = this.drawerElement.nativeElement.offsetHeight;
    const draggedPercentage = (this.dragOffset() / drawerHeight) * 100;

    this.setTransition(true);

    if (draggedPercentage > 50) {
      this.close();
    } else {
      this.dragOffset.set(0);
    }
  }

  public close(): void {
    this.closed.emit();
  }

  private setTransition(enabled: boolean): void {
    this.drawerElement.nativeElement.style.transition = enabled
      ? `transform ${DRAWER_CONFIG.SNAP_DURATION}ms ${DRAWER_CONFIG.TRANSITION_TIMING}`
      : 'none';
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}

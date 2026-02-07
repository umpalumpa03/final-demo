import {
  Component,
  input,
  output,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-ui-modal',
  templateUrl: './ui-modal.html',
  styleUrls: ['./ui-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiModal {
  public isOpen = input.required<boolean>();
  public closed = output<void>();

  public hasNavigation = input<boolean>(false);
  public navigate = output<number>();

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

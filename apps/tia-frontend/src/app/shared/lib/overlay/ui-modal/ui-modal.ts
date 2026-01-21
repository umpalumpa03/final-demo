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

  public close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.close();
  }
}

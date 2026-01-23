import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-ui-drawer',
  imports: [],
  templateUrl: './ui-drawer.html',
  styleUrl: './ui-drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDrawer {
  public isOpen = input<boolean>();
  public closed = output<void>();

  public close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}

import { Component, HostListener, input, output } from '@angular/core';
import { SheetDirection } from './types/sheet.model';

@Component({
  selector: 'app-ui-sheet-modal',
  imports: [],
  templateUrl: './ui-sheet-modal.html',
  styleUrl: './ui-sheet-modal.scss',
})
export class UiSheetModal {
  public isOpen = input.required<boolean>();
  public direction = input<SheetDirection>('right');
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

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  output,
} from '@angular/core';
import { ContextMenuItem, ContextMenuViewModel } from './models/context.model';

@Component({
  selector: 'app-ui-context',
  imports: [],
  templateUrl: './ui-context.html',
  styleUrl: './ui-context.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiContext {
  public position = input.required<{ x: number; y: number }>();
  public items = input.required<(ContextMenuItem | 'divider')[]>();

  public itemClick = output<string>();
  public menuClose = output<void>();

  public readonly menuStyle = computed(() => ({
    top: `${this.position().y}px`,
    left: `${this.position().x}px`,
  }));

  public readonly processedItems = computed(() => {
    return this.items().map((item) => {
      if (item === 'divider') return item;

      return {
        ...item,
        iconPath: item.icon
          ? `url(images/svg/context/${item.icon}.svg)`
          : undefined,
      } as ContextMenuViewModel;
    });
  });

  @HostListener('window:scroll')
  @HostListener('window:resize')
  @HostListener('document:wheel')
  public onGlobalInteraction(): void {
    this.menuClose.emit();
  }

  public handleAction(action: string): void {
    this.itemClick.emit(action);
    this.menuClose.emit();
  }
}

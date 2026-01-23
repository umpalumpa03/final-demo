import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { menuItems } from './config/context.config';
import { UiContext } from '../../../../../../../../shared/lib/overlay/ui-context/ui-context';
import { LibraryTitle } from '../../../../shared/library-title/library-title';

@Component({
  selector: 'app-context-demo',
  imports: [UiContext, LibraryTitle],
  templateUrl: './context-demo.html',
  styleUrl: './context-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextDemo {
  public isMenuVisible = signal<boolean>(false);
  public menuPosition = signal({ x: 0, y: 0 });
  public readonly menuItems = menuItems;
  public readonly contextTitle: string = 'Context Menu';
  public readonly contextSubtitle: string =
    'Right-click on the area below to open the context menu:';

  public onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.menuPosition.set({ x: event.clientX, y: event.clientY });
    this.isMenuVisible.set(true);
  }

  public handleAction(): void {
    this.isMenuVisible.set(false);
  }
}

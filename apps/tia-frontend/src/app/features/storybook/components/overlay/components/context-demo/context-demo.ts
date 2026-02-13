import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getMenuItems } from './config/context.config';
import { UiContext } from '../../../../../../shared/lib/overlay/ui-context/ui-context';
import { LibraryTitle } from '../../../../shared/library-title/library-title';

@Component({
  selector: 'app-context-demo',
  imports: [UiContext, LibraryTitle],
  templateUrl: './context-demo.html',
  styleUrl: './context-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextDemo implements OnInit {
  private readonly translate = inject(TranslateService);

  public isMenuVisible = signal<boolean>(false);
  public menuPosition = signal({ x: 0, y: 0 });
  public readonly menuItems = signal(getMenuItems(this.translate));
  public readonly contextTitle = signal(this.translate.instant('storybook.overlays.contextMenu.title'));
  public readonly contextSubtitle = signal(this.translate.instant('storybook.overlays.contextMenu.subtitle'));
  public readonly contextHint = signal(this.translate.instant('storybook.overlays.contextMenu.hint'));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.menuItems.set(getMenuItems(this.translate));
      this.contextTitle.set(this.translate.instant('storybook.overlays.contextMenu.title'));
      this.contextSubtitle.set(this.translate.instant('storybook.overlays.contextMenu.subtitle'));
      this.contextHint.set(this.translate.instant('storybook.overlays.contextMenu.hint'));
    });
  }

  public onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.menuPosition.set({ x: event.clientX, y: event.clientY });
    this.isMenuVisible.set(true);
  }

  public handleAction(): void {
    this.isMenuVisible.set(false);
  }
}

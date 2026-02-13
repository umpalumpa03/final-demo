import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UiDrawer } from '../../../../../../shared/lib/overlay/ui-drawer/ui-drawer';
import { TextInput } from '../../../../../../shared/lib/forms/input-field/text-input';
import { getEmailConfig, getNameConfig } from './config/inputs.config';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-drawer-modal',
  imports: [UiDrawer, TextInput, LibraryTitle, ButtonComponent, TranslatePipe],
  templateUrl: './drawer-modal.html',
  styleUrl: './drawer-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerModal implements OnInit {
  private readonly translate = inject(TranslateService);

  public isOpen = signal<boolean>(false);
  public readonly nameConfig = signal(getNameConfig(this.translate));
  public readonly emailConfig = signal(getEmailConfig(this.translate));
  public readonly drawerTitle = signal(this.translate.instant('storybook.overlays.drawer.title'));
  public readonly drawerSubtitle = signal(this.translate.instant('storybook.overlays.drawer.subtitle'));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.nameConfig.set(getNameConfig(this.translate));
      this.emailConfig.set(getEmailConfig(this.translate));
      this.drawerTitle.set(this.translate.instant('storybook.overlays.drawer.title'));
      this.drawerSubtitle.set(this.translate.instant('storybook.overlays.drawer.subtitle'));
    });
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }

  public onSubmit(): void {
    this.toggle();
  }
}

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { LibraryTitle } from '../../../../shared/library-title/library-title';
import { getTermsAndConditions } from './config/dialog.config';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';

@Component({
  selector: 'app-large-dialog',
  imports: [UiModal, ButtonComponent, LibraryTitle, TranslatePipe],
  templateUrl: './large-dialog.html',
  styleUrl: './large-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LargeDialog implements OnInit {
  private readonly translate = inject(TranslateService);

  public isOpen = signal<boolean>(false);
  public readonly pageTitle = signal(this.translate.instant('storybook.overlays.largeDialog.title'));
  public readonly pageSubtitle = signal(this.translate.instant('storybook.overlays.largeDialog.subtitle'));
  public readonly sections = signal(getTermsAndConditions(this.translate));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.pageTitle.set(this.translate.instant('storybook.overlays.largeDialog.title'));
      this.pageSubtitle.set(this.translate.instant('storybook.overlays.largeDialog.subtitle'));
      this.sections.set(getTermsAndConditions(this.translate));
    });
  }

  public toggle(): void {
    this.isOpen.update((v) => !v);
  }
}

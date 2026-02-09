import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { Palettes } from '../../../../shared/lib/palettes/palettes';
import { getColorPalettes } from './config/palette-data.config';
import { ColorApplication } from '../../../../shared/lib/palettes/color-application/color-application';
import { Notes } from '../../../../shared/lib/palettes/notes/notes';

@Component({
  selector: 'app-colorpalettes',
  imports: [
    LibraryTitle,
    ShowcaseCard,
    Palettes,
    ColorApplication,
    Notes,
    TranslatePipe,
  ],
  templateUrl: './colorpalettes.html',
  styleUrl: './colorpalettes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Colorpalettes {
  private readonly translate = inject(TranslateService);

  public readonly title = this.translate.instant('storybook.palette.title');
  public readonly subtitle = this.translate.instant(
    'storybook.palette.subtitle',
  );
  public readonly colorPalettesData = getColorPalettes(this.translate);
}

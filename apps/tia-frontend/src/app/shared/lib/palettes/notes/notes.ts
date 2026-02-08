import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getNotesData } from 'apps/tia-frontend/src/app/features/storybook/components/colorpalettes/config/palette-data.config';

@Component({
  selector: 'app-notes',
  imports: [],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notes {
  private readonly translate = inject(TranslateService);
  public readonly notes = computed(() => getNotesData(this.translate));
  public readonly theme = computed(() => 'oceanblue');
}

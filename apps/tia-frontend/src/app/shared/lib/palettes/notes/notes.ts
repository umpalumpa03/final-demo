import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { NOTES_DATA } from 'apps/tia-frontend/src/app/features/storybook/components/colorpalettes/config/palette-data.config';

@Component({
  selector: 'app-notes',
  imports: [],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notes {
  public readonly notes = computed(() => NOTES_DATA);
  public readonly theme = computed(() => 'oceanblue');
}

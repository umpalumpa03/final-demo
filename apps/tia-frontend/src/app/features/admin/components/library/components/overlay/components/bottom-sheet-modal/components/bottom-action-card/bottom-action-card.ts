import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-bottom-action-card',
  imports: [],
  templateUrl: './bottom-action-card.html',
  styleUrl: './bottom-action-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomActionCard {
  public readonly label = input.required<string>();
  public readonly icon = input.required<string>();

  public readonly iconMaskPath = computed(() => {
    return `url(/images/svg/overlay/${this.icon()}.svg)`;
  });
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-basic-card',
  imports: [],
  templateUrl: './basic-card.html',
  styleUrl: './basic-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicCard {
  public readonly title = input<string>();
  public readonly subtitle = input<string>('');
  public readonly content = input<string>('');
  public readonly width = input<string>();
  public readonly height = input<string>();
  public readonly hasFooter = input<boolean>(false);
  public readonly hasHover = input<boolean>(false);
  public readonly flex = input<string>();
  public readonly minWidth = input<string>();
  public readonly maxWidth = input<string>();
  public readonly display = input<string>();
  public readonly flexDirection = input<string>();
  public readonly alignItems = input<string>();
  public readonly justifyContent = input<string>();
  public readonly minHeight = input<string>();
  public readonly padding = input<string>();
  public readonly borderColor = input<string>('');
  public readonly gap = input<string>();
  public readonly backgroundColor = input<string>();
  public readonly hasTransition = input<boolean>(false);
  public readonly customTransition = input<string>('all 0.3s ease');
  public readonly transition = computed(() => {
    return this.hasTransition() ? this.customTransition() : 'none';
  });
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkeletonVariant } from '../models/skeleton.model';

@Component({
  selector: 'app-skeleton',
  imports: [],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Skeleton {
  public readonly width = input<string>('100%');
  public readonly height = input<string>('2rem');
  public readonly variant = input<SkeletonVariant>('text');

  public readonly classes = computed(() => `skeleton skeleton--${this.variant()}`);

  public readonly computedWidth = computed(() => {
    return this.variant() === 'circle'
      ? this.height()
      : this.width();
  });

  public readonly computedHeight = computed(() => {
    return this.height();
  });
}

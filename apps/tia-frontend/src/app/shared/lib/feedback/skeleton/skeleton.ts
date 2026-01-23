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
  width = input<string>('100%');
  height = input<string>('2rem');
  variant = input<SkeletonVariant>('text');

  classes = computed(() => `skeleton skeleton--${this.variant()}`);

  computedWidth = computed(() => {
    return this.variant() === 'circle'
      ? this.height()
      : this.width();
  });

  computedHeight = computed(() => {
    return this.height();
  });
}

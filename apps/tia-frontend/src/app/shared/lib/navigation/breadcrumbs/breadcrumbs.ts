import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Breadcrumb } from '../models/breadcrumbs.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterModule],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumbs {
  public readonly breadcrumbs = input<Breadcrumb[]>();

  protected readonly lastCrumb = computed(() => {
    const crumbs = this.breadcrumbs();
    return crumbs?.[crumbs.length - 1];
  });
}

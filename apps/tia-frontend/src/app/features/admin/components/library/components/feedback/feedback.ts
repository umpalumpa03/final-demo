import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '../../../../../../shared/lib/feedback/skeleton/skeleton';
import { ShowcaseCard } from '../../../../../../features/admin/components/library/shared/showcase-card/showcase-card';
import { BasicCard } from '../../../../../../shared/lib/cards/basic-card/basic-card';
import { Spinner } from '../../../../../../shared/lib/feedback/spinner/spinner';
import { RouteLoader } from '../../../../../../shared/lib/feedback/route-loader/route-loader';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/admin/components/library/shared/library-title/library-title';
import { LOADING_CARDS, TEXT_SKELETONS, IMAGE_SKELETONS, LIST_ITEMS } from './config/feedback.config';

@Component({
  selector: 'app-feedback',
  imports: [Skeleton, ShowcaseCard, BasicCard, Spinner, LibraryTitle, RouteLoader],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Feedback {
  loadingCards = LOADING_CARDS;
  textSkeletons = TEXT_SKELETONS;
  imageSkeletons = IMAGE_SKELETONS;
  listItems = LIST_ITEMS;
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '../../../../shared/lib/feedback/skeleton/skeleton';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { BasicCard } from '../../../../shared/lib/cards/basic-card/basic-card';
import { Spinner } from '../../../../shared/lib/feedback/spinner/spinner';
import { RouteLoader } from '../../../../shared/lib/feedback/route-loader/route-loader';
import { LibraryTitle } from '../../shared/library-title/library-title';
import {
  LOADING_CARDS,
  TEXT_SKELETONS,
  IMAGE_SKELETONS,
  LIST_ITEMS,
} from './config/feedback.config';

@Component({
  selector: 'app-feedback',
  imports: [
    Skeleton,
    ShowcaseCard,
    BasicCard,
    Spinner,
    LibraryTitle,
    RouteLoader,
  ],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Feedback {
  public readonly loadingCards = LOADING_CARDS;
  public readonly textSkeletons = TEXT_SKELETONS;
  public readonly imageSkeletons = IMAGE_SKELETONS;
  public readonly listItems = LIST_ITEMS;

  protected readonly trackById = (_: number, item: { id: string }) => item.id;
}

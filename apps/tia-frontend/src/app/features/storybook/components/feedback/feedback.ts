import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
import { ErrorStates } from '../../../../shared/lib/feedback/error-states/error-states';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    Skeleton,
    ShowcaseCard,
    BasicCard,
    Spinner,
    LibraryTitle,
    RouteLoader,
    ErrorStates,
    TranslateModule,
  ],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Feedback implements OnInit {
  private translate = inject(TranslateService);

  public loadingCards = LOADING_CARDS;
  public textSkeletons = TEXT_SKELETONS;
  public imageSkeletons = IMAGE_SKELETONS;
  public listItems = LIST_ITEMS;

  ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.loadingCards = [...LOADING_CARDS];
      this.textSkeletons = [...TEXT_SKELETONS];
      this.imageSkeletons = [...IMAGE_SKELETONS];
      this.listItems = [...LIST_ITEMS];
    });
  }

  protected readonly trackById = (_: number, item: { id: string }) => item.id;
}

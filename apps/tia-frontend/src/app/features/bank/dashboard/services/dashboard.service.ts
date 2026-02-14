import {
  inject,
  Injectable,
  signal,
  computed,
  effect,
  untracked,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IWidgetItem } from '../models/widgets.model';
import { catalog } from '../config/widgets.config';
import { selectUserWidgets } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import { DraggableItemType } from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);
  private readonly breakpointService = inject(BreakpointService);

  public readonly myItems = signal<IWidgetItem[]>([]);
  public readonly widgetCatalog = signal(catalog);

  public readonly accountsHidden = signal(false);

  public readonly visibleItems = computed(() =>
    this.myItems().filter((item) => {
      if (item.type === 'transactions' || item.type === 'accounts') {
        return true;
      }
      return !item.isHidden;
    }),
  );

  private readonly updateStream$ = new Subject<IWidgetItem[]>();
  private dirtyIds = new Set<string>();

  constructor() {
    effect(
      () => {
        const storeWidgets = this.store.selectSignal(selectUserWidgets)();

        if (this.dirtyIds.size === 0) {
          this.myItems.set(storeWidgets);
        }
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      const items = this.myItems();
      const accountsWidget = items.find((w) => w.type === 'accounts');
      if (accountsWidget) {
        untracked(() =>
          this.accountsHidden.set(accountsWidget.isHidden || false),
        );
      }
    });

    this.updateStream$
      .pipe(
        debounceTime(1500),
        tap((allWidgets) => this.persistChanges(allWidgets)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  public readonly gridColumns = computed(() => {
    const itemCount = this.myItems().length;
    const isVertical = this.breakpointService.isTablet() || itemCount < 3;
    return isVertical
      ? { default: 1, md: 1, sm: 1 }
      : { default: 2, md: 2, sm: 1 };
  });

  public readonly dynamicColspans = computed(() => {
    const items = this.myItems();
    const isVertical = this.breakpointService.isTablet() || items.length < 3;
    return items.map((_, index) => (isVertical ? 1 : index === 0 ? 2 : 1));
  });

  public readonly processedItems = computed(() => {
    return this.myItems().map((item) => {
      const isAccount = item.type === 'accounts';

      const visualHiddenStatus = isAccount ? false : item.isHidden;

      const visualEyeStatus = isAccount
        ? !this.accountsHidden()
        : !item.isHidden;

      return {
        ...item,
        isHidden: visualHiddenStatus,
        isViewable: visualEyeStatus,
        headerData: {
          id: item.id,
          title: this.translate.instant(`dashboard.widgets.${item.type}.title`),
          subtitle: this.translate.instant(
            `dashboard.widgets.${item.type}.subtitle`,
          ),
          icon: `/images/svg/dashboard/${item.type}.svg`,
        } as DraggableItemType,
      };
    });
  });

  public updateItemsOnDrag(reorderedVisibleItems: IWidgetItem[]): void {
    const visibleIds = new Set(reorderedVisibleItems.map((i) => i.id));
    const hiddenItems = this.myItems().filter(
      (item) => !visibleIds.has(item.id),
    );

    const newVisibleList = reorderedVisibleItems.map((item, index) => ({
      ...item,
      order: index + 1,

      hasFullWidth: index === 0,

      isHidden: !!item.isHidden,
    }));

    newVisibleList.forEach((item) => this.dirtyIds.add(item.id));
    const newMasterList = [...newVisibleList, ...hiddenItems];

    this.myItems.set(newMasterList);
    this.updateStream$.next(newMasterList);

    this.store.dispatch(
      UserInfoActions.loadWidgetsSuccess({ widgets: newMasterList }),
    );
  }

  public foldWidget(isSelected: boolean, id: string): void {
    this.dirtyIds.add(id);

    this.myItems.update((items) =>
      items.map((i) => (i.id === id ? { ...i, isHidden: !isSelected } : i)),
    );

    this.updateStream$.next(this.myItems());
    this.store.dispatch(
      UserInfoActions.loadWidgetsSuccess({ widgets: this.myItems() }),
    );
  }

  public toggleCatalogWidget(isSelected: boolean, id: string): void {
    const existingWidget = this.myItems().find((w) => w.id === id);
    const widgetIndex = this.myItems().findIndex((w) => w.id === id);

    if (isSelected && widgetIndex === -1) {
      const catalogWidget = this.widgetCatalog().find((w) => w.id === id);
      if (catalogWidget) {
        const activeCount = this.visibleItems().length;
        this.store.dispatch(
          UserInfoActions.createWidget({
            widget: {
              ...catalogWidget,
              order: activeCount + 1,
              hasFullWidth: activeCount === 0,
              isHidden: false,
            },
          }),
        );
      }
    } else if (!isSelected && existingWidget?.dbId) {
      this.store.dispatch(
        UserInfoActions.deleteWidget({ id: existingWidget.dbId }),
      );

      this.myItems.update((items) => items.filter((i) => i.id !== id));

      this.dirtyIds.delete(id);
    }
  }

  private persistChanges(allWidgets: IWidgetItem[]): void {
    const updates = allWidgets
      .filter((item) => !!item.dbId && this.dirtyIds.has(item.id))
      .map((item) => ({
        id: item.dbId!,
        updates: {
          order: item.order,
          hasFullWidth: item.hasFullWidth,
          isHidden: !!item.isHidden,
          widgetName:
            this.widgetCatalog().find((c) => c.id === item.id)?.title ||
            item.title,
        },
      }));

    this.dirtyIds.clear();
    if (updates.length > 0) {
      this.store.dispatch(UserInfoActions.updateWidgetsBulk({ updates }));
    }
  }

  public syncWidgetsFromDraft(draftIds: string[]): void {
    const currentItems = this.myItems();
    const currentIds = currentItems.map((w) => w.id);

    draftIds.forEach((id) => {
      if (!currentIds.includes(id)) {
        const catalogWidget = this.widgetCatalog().find((w) => w.id === id);

        if (catalogWidget) {
          const activeCount = currentItems.length;

          this.store.dispatch(
            UserInfoActions.createWidget({
              widget: {
                ...catalogWidget,
                order: activeCount + 1,
                hasFullWidth: !!(activeCount === 0),
                isHidden: false,
              },
            }),
          );
        }
      }
    });

    currentItems.forEach((item) => {
      if (!draftIds.includes(item.id) && item.dbId) {
        this.store.dispatch(UserInfoActions.deleteWidget({ id: item.dbId }));
      }
    });
  }
}

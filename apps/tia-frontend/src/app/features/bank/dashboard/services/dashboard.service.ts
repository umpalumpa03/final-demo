import { inject, Injectable, signal, computed, effect } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IWidgetItem } from '../models/widgets.model';
import { catalog } from '../config/widgets.config';
import { selectUserWidgets } from 'apps/tia-frontend/src/app/store/user-info/user-info.selectors';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly store = inject(Store);

  public readonly myItems = signal<IWidgetItem[]>([]);
  public readonly widgetCatalog = signal(catalog);

  public readonly visibleItems = computed(() =>
    this.myItems().filter((item, index) => index === 0 || !item.isHidden),
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

    this.updateStream$
      .pipe(
        debounceTime(1000),
        tap((allWidgets) => this.persistChanges(allWidgets)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  public updateItemsOnDrag(reorderedVisibleItems: IWidgetItem[]): void {
    const visibleIds = new Set(reorderedVisibleItems.map((i) => i.id));
    const hiddenItems = this.myItems().filter(
      (item) => !visibleIds.has(item.id),
    );

const newVisibleList = reorderedVisibleItems.map((item, index) => ({
      ...item,
      order: index + 1,
      // The first item is still the logical 'Hero'
      hasFullWidth: index === 0, 
      // PRESERVE the isHidden state for all items during drag
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

    // Sync state for persistence and immediate store update
    this.updateStream$.next(this.myItems());
    this.store.dispatch(
      UserInfoActions.loadWidgetsSuccess({ widgets: this.myItems() }),
    );
  }

  public toggleCatalogWidget(isSelected: boolean, id: string): void {
    const existingWidget = this.myItems().find((w) => w.id === id);
    const widgetIndex = this.myItems().findIndex((w) => w.id === id);

    if (widgetIndex === -1 && isSelected) {
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
    } else if (!isSelected && widgetIndex > 0 && existingWidget?.dbId) {
      this.store.dispatch(
        UserInfoActions.deleteWidget({ id: existingWidget.dbId }),
      );
      this.myItems.update((items) => items.filter((i) => i.id !== id));
    } else if (widgetIndex === 0) {
      this.foldWidget(isSelected, id);
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
}

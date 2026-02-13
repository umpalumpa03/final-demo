import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import { signal, WritableSignal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IWidgetItem } from '../models/widgets.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let store: MockStore;
  let mockStoreSignal: WritableSignal<IWidgetItem[]>;

  const mockWidgets: IWidgetItem[] = [
    {
      id: '1',
      dbId: 'db-1',
      title: 'Widget 1',
      order: 1,
      hasFullWidth: true,
      isHidden: false,
      type: 'transactions',
      subtitle: 'gela',
    },
    {
      id: '2',
      dbId: 'db-2',
      title: 'Widget 2',
      order: 2,
      hasFullWidth: false,
      isHidden: false,
      type: 'accounts',
      subtitle: 'gela',
    },
  ];

  beforeEach(() => {
    mockStoreSignal = signal(mockWidgets);

    TestBed.configureTestingModule({
      providers: [DashboardService, provideMockStore({ initialState: {} })],
    });

    store = TestBed.inject(MockStore);

    vi.spyOn(store, 'selectSignal').mockReturnValue(mockStoreSignal);

    service = TestBed.inject(DashboardService);
    service.widgetCatalog.set(mockWidgets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateItemsOnDrag', () => {
    it('should reorder items and enforce hero-width on the first item', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const reordered = [mockWidgets[1], mockWidgets[0]];

      service.updateItemsOnDrag(reordered);

      const items = service.myItems();
      expect(items[0].id).toBe('2');
      expect(items[0].order).toBe(1);
      expect(items[0].hasFullWidth).toBe(true);
      expect(dispatchSpy).toHaveBeenCalledWith(
        UserInfoActions.loadWidgetsSuccess({ widgets: expect.any(Array) }),
      );
    });
  });

  describe('toggleCatalogWidget', () => {
    it('should dispatch createWidget when adding a new item from catalog', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      service.myItems.set([mockWidgets[0]]);

      service.toggleCatalogWidget(true, '2');

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: UserInfoActions.createWidget.type,
        }),
      );
    });

    it('should dispatch deleteWidget when removing a non-hero widget', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      service.myItems.set(mockWidgets);

      service.toggleCatalogWidget(false, '2');

      expect(dispatchSpy).toHaveBeenCalledWith(
        UserInfoActions.deleteWidget({ id: 'db-2' }),
      );
    });
  });

  describe('Persistence Logic (Manual Trigger for Coverage)', () => {
    it('should dispatch updateWidgetsBulk when persistChanges is called with dirty IDs', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      (service as any).dirtyIds.add('1');
      service.myItems.set(mockWidgets);

      (service as any).persistChanges(mockWidgets);

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: UserInfoActions.updateWidgetsBulk.type,
          updates: expect.arrayContaining([
            expect.objectContaining({ id: 'db-1' }),
          ]),
        }),
      );

      expect((service as any).dirtyIds.size).toBe(0);
    });

    it('should synchronize myItems with store widgets when dirtyIds is empty', () => {
      const newStoreWidgets = [
        ...mockWidgets,
        { id: '3', title: 'New Widget' } as any,
      ];

      mockStoreSignal.set(newStoreWidgets);
      TestBed.flushEffects();

      expect(service.myItems()).toEqual(newStoreWidgets);
    });

    it('should toggle visibility, add to dirtyIds, and dispatch success', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      service.myItems.set(mockWidgets);

      service.foldWidget(false, '1');

      expect((service as any).dirtyIds.has('1')).toBe(true);
      expect(service.myItems()[0].isHidden).toBe(true);
      expect(dispatchSpy).toHaveBeenCalledWith(
        UserInfoActions.loadWidgetsSuccess({ widgets: service.myItems() }),
      );
    });

    it('should always include transactions even if hidden, and obey isHidden for others', () => {
      const mixedWidgets: IWidgetItem[] = [
        { id: 't1', type: 'transactions', isHidden: true, title: 'T' } as any,
        { id: 'a1', type: 'accounts', isHidden: true, title: 'A' } as any,
        { id: 'e1', type: 'exchange', isHidden: false, title: 'E' } as any,
      ];
      service.myItems.set(mixedWidgets);

      const visible = service.visibleItems();

      expect(visible.find((w) => w.id === 't1')).toBeDefined();

      expect(visible.find((w) => w.id === 'a1')).toBeUndefined();

      expect(visible.find((w) => w.id === 'e1')).toBeDefined();
    });

    it('should trigger persistChanges after 1500ms debounce', () => {
      vi.useFakeTimers();
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      (service as any).dirtyIds.add('1');
      service.myItems.set(mockWidgets);
      (service as any).updateStream$.next(mockWidgets);

      vi.advanceTimersByTime(1500);

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: UserInfoActions.updateWidgetsBulk.type,
        }),
      );
      vi.useRealTimers();
    });

    it('should dispatch deleteWidget when an existing item with a dbId is missing from the draft', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      service.myItems.set(mockWidgets);

      const draftIds = ['1'];
      service.syncWidgetsFromDraft(draftIds);

      expect(dispatchSpy).toHaveBeenCalledWith(
        UserInfoActions.deleteWidget({ id: 'db-2' }),
      );
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IWidgetItem } from '../models/widgets.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let store: MockStore;

  const mockWidgets: IWidgetItem[] = [
    {
      id: '1',
      dbId: 'db-1',
      title: 'Widget 1',
      order: 1,
      hasFullWidth: true,
      isHidden: false,
      type: 'transactions',
    },
    {
      id: '2',
      dbId: 'db-2',
      title: 'Widget 2',
      order: 2,
      hasFullWidth: false,
      isHidden: false,
      type: 'accounts',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService, provideMockStore({ initialState: {} })],
    });

    store = TestBed.inject(MockStore);

    vi.spyOn(store, 'selectSignal').mockReturnValue(signal(mockWidgets));

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

    it('should delegate to foldWidget if toggling the hero widget', () => {
      const foldSpy = vi.spyOn(service, 'foldWidget');
      service.myItems.set(mockWidgets);

      service.toggleCatalogWidget(false, '1');

      expect(foldSpy).toHaveBeenCalledWith(false, '1');
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

    it('should not dispatch if no items are marked dirty', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      (service as any).dirtyIds.clear();

      (service as any).persistChanges(mockWidgets);

      const bulkCalls = dispatchSpy.mock.calls.filter(
        (c) => c[0].type === UserInfoActions.updateWidgetsBulk.type,
      );
      expect(bulkCalls.length).toBe(0);
    });
  });
});

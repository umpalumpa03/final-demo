import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import { signal, WritableSignal } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { IWidgetItem } from '../models/widgets.model';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';
import { of } from 'rxjs';

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

  const mockCatalog = [
    { id: '1', title: 'Widget 1', type: 'transactions' },
    { id: '2', title: 'Widget 2', type: 'accounts' },
  ];

  beforeEach(() => {
    mockStoreSignal = signal(mockWidgets);

    const mockTranslate = {
      instant: vi.fn((key) => key),
      get: vi.fn(() => of('')),
    };

    const mockBreakpoint = {
      isTablet: signal(false),
      isXsMobile: signal(false),
    };

    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        provideMockStore({ initialState: {} }),
        { provide: TranslateService, useValue: mockTranslate },
        { provide: BreakpointService, useValue: mockBreakpoint },
      ],
    });

    store = TestBed.inject(MockStore);

    vi.spyOn(store, 'selectSignal').mockReturnValue(mockStoreSignal);

    service = TestBed.inject(DashboardService);
    service.widgetCatalog.set(mockCatalog as any);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
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
    it('should dispatch createWidget when adding a new item', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      service.myItems.set([mockWidgets[0]]);

      service.toggleCatalogWidget(true, '2');

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: UserInfoActions.createWidget.type }),
      );
    });

    it('should dispatch deleteWidget when removing a widget with dbId', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      service.myItems.set(mockWidgets);

      service.toggleCatalogWidget(false, '2');

      expect(dispatchSpy).toHaveBeenCalledWith(
        UserInfoActions.deleteWidget({ id: 'db-2' }),
      );
    });
  });

  describe('visibleItems Computed Logic', () => {
    it('should always include transactions and accounts even if hidden', () => {
      const mixedWidgets: IWidgetItem[] = [
        { id: 't1', type: 'transactions', isHidden: true } as any,
        { id: 'a1', type: 'accounts', isHidden: true } as any,
        { id: 'e1', type: 'exchange', isHidden: true } as any,
      ];
      service.myItems.set(mixedWidgets);

      const visible = service.visibleItems();

      expect(visible.find((w) => w.id === 't1')).toBeDefined();
      expect(visible.find((w) => w.id === 'a1')).toBeDefined();
      expect(visible.find((w) => w.id === 'e1')).toBeUndefined();
    });
  });

  describe('Persistence & Sync', () => {
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
    });

    it('should dispatch deleteWidget for items missing from draft', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      service.myItems.set(mockWidgets);

      service.syncWidgetsFromDraft(['1']);

      expect(dispatchSpy).toHaveBeenCalledWith(
        UserInfoActions.deleteWidget({ id: 'db-2' }),
      );
    });

    describe('foldWidget', () => {
      it('should update visibility, add to dirtyIds, and dispatch loadWidgetsSuccess', () => {
        const dispatchSpy = vi.spyOn(store, 'dispatch');
        service.myItems.set(mockWidgets);

        service.foldWidget(false, '1');

        expect((service as any).dirtyIds.has('1')).toBe(true);

        const updatedItem = service.myItems().find((i) => i.id === '1');
        expect(updatedItem?.isHidden).toBe(true);

        expect(dispatchSpy).toHaveBeenCalledWith(
          UserInfoActions.loadWidgetsSuccess({ widgets: service.myItems() }),
        );
      });

      it('should unfold a widget correctly', () => {
        const hiddenWidgets = mockWidgets.map((w) =>
          w.id === '1' ? { ...w, isHidden: true } : w,
        );
        service.myItems.set(hiddenWidgets);

        service.foldWidget(true, '1');

        expect(service.myItems().find((i) => i.id === '1')?.isHidden).toBe(
          false,
        );
      });
    });
  });

  describe('Responsive Layout Signals', () => {
    it('dynamicColspans: should return [2, 1, 1] when NOT tablet and 3+ items exist', () => {
      (service as any).breakpointService.isTablet.set(false);
      service.myItems.set([{ id: '1' }, { id: '2' }, { id: '3' }] as any);

      expect(service.dynamicColspans()).toEqual([2, 1, 1]);
    });

    it('dynamicColspans: should return [1, 1] when < 3 items exist', () => {
      (service as any).breakpointService.isTablet.set(false);
      service.myItems.set([{ id: '1' }, { id: '2' }] as any);

      expect(service.dynamicColspans()).toEqual([1, 1]);
    });

    it('processedItems: should handle special visibility logic for accounts', () => {
      service.myItems.set([
        { id: 'acc', type: 'accounts', isHidden: true },
      ] as any);

      const processed = service.processedItems();

      expect(processed[0].isHidden).toBe(false);
      expect(processed[0].isViewable).toBe(false);
    });
  });
});

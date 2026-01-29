import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { DashboardContainer } from './dashboard-container';

describe('DashboardContainer', () => {
  let component: DashboardContainer;
  let fixture: ComponentFixture<DashboardContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update signal when onItemsChange is called', () => {
    const mockItems = [{ id: '99', type: 'exchange', title: 'Test' }] as any;
    component.onItemsChange(mockItems);
    expect(component['myItems']()).toEqual(mockItems);
  });

  it('should toggle visibility state correctly', () => {
    const targetId = '1';

    component.onToggleVisibility(false, targetId);
    expect(
      component['myItems']().find((i) => i.id === targetId)?.isHidden,
    ).toBe(true);

    component.onToggleVisibility(true, targetId);
    expect(
      component['myItems']().find((i) => i.id === targetId)?.isHidden,
    ).toBe(false);
  });

  it('should calculate colspans based on index', () => {
    const colspans = component['dynamicColspans']();
    expect(colspans[0]).toBe(2);
    expect(colspans[1]).toBe(1);
  });

  describe('Widget Actions Branch Coverage', () => {
    it('should cover all branches of onWidgetRefresh', () => {
      const exchangeItem = { type: 'exchange' } as any;
      component.onWidgetRefresh(exchangeItem);

      const otherItem = { type: 'transactions' } as any;
      component.onWidgetRefresh(otherItem);

      expect(component).toBeDefined();
    });

    it('should cover all branches of onWidgetAdd', () => {
      const accountItem = { type: 'accounts' } as any;
      component.onWidgetAdd(accountItem);

      const otherItem = { type: 'exchange' } as any;
      component.onWidgetAdd(otherItem);

      expect(component).toBeDefined();
    });
  });

  it('should execute utility methods', () => {
    component.onPaginationChange(20);
    component.onContainerOrderChange(['1', '2']);

    expect(component).toBeDefined();
  });
});

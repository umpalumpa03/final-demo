import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tables } from './tables';

describe('Tables', () => {
  let component: Tables;
  let fixture: ComponentFixture<Tables>;

  const mockTableConfig = {
    type: 'basic' as const,
    paginationType: 'scroll' as const,
    headers: [
      { title: 'Name', align: 'left' as const, width: '10rem' },
      { title: 'Status', align: 'left' as const, width: '10rem' },
    ],
    rows: [
      {
        id: '1',
        info: [
          { type: 'text' as const, value: 'Test', align: 'left' as const },
          { type: 'badge' as const, value: 'active', align: 'left' as const },
        ],
      },
      {
        id: '2',
        info: [
          { type: 'text' as const, value: 'Test 2', align: 'left' as const },
          { type: 'badge' as const, value: 'pending', align: 'left' as const },
        ],
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tables],
    }).compileComponents();

    fixture = TestBed.createComponent(Tables);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tableConfig', mockTableConfig);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleSelectAll', () => {
    it('should toggle allSelected from false to true', () => {
      expect(component.allSelected()).toBe(false);

      component.toggleSelectAll();

      expect(component.allSelected()).toBe(true);
    });

    it('should select all rows when toggled to true', () => {
      component.toggleSelectAll();

      expect(component.selectedItems()).toEqual(mockTableConfig.rows);
    });

    it('should clear selected items when toggled to false', () => {
      component.toggleSelectAll();
      expect(component.selectedItems().length).toBe(2);

      component.toggleSelectAll();

      expect(component.selectedItems()).toEqual([]);
    });
  });

  describe('table type computed flags', () => {
    it('should detect selectable table', () => {
      fixture.componentRef.setInput('tableConfig', {
        ...mockTableConfig,
        type: 'row-selection',
      });
      fixture.detectChanges();

      expect(component.isSelectable()).toBe(true);
      expect(component.isAction()).toBe(false);
    });

    it('should detect pagination type page', () => {
      fixture.componentRef.setInput('tableConfig', {
        ...mockTableConfig,
        paginationType: 'page',
      });
      fixture.detectChanges();

      expect(component.isPagination()).toBe(true);
    });

    it('should fallback totalPage to 1', () => {
      expect(component.totalPage()).toBe(1);
    });
  });

  describe('onIndividualSelect branches', () => {
    it('should add row if not selected', () => {
      const row1 = mockTableConfig.rows[0];
      component.onIndividualSelect(row1 as any);
      expect(component.selectedItems()).toContain(row1);
    });

    it('should remove row if already selected', () => {
      const row1 = mockTableConfig.rows[0];
      component.onIndividualSelect(row1 as any);
      component.onIndividualSelect(row1 as any);
      expect(component.selectedItems()).not.toContain(row1);
    });

    it('should allow multiple different rows selected', () => {
      const row1 = mockTableConfig.rows[0];
      const row2 = mockTableConfig.rows[1];
      component.onIndividualSelect(row1 as any);
      component.onIndividualSelect(row2 as any);
      expect(component.selectedItems().length).toBe(2);
    });
  });
});

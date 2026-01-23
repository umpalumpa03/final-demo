import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tables } from './tables';

describe('Tables', () => {
  let component: Tables;
  let fixture: ComponentFixture<Tables>;

  const mockTableConfig = {
    type: 'basic',
    paginationType: 'scroll',
    headers: [
      { title: 'Name', align: 'left', width: '10rem' },
      { title: 'Status', align: 'left', width: '10rem' },
    ],
    rows: [
      {
        id: '1',
        info: [
          { type: 'text', value: 'Test', align: 'left' },
          { type: 'badge', value: 'active', align: 'left' },
        ],
      },
      {
        id: '2',
        info: [
          { type: 'text', value: 'Test 2', align: 'left' },
          { type: 'badge', value: 'pending', align: 'left' },
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
});

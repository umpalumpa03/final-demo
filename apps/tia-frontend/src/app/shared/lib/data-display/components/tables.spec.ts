// tables.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Tables } from './tables';
import { TableConfig } from '../models/table.model';

describe('Tables', () => {
  let component: Tables;
  let fixture: ComponentFixture<Tables>;

  const mockTableConfig: TableConfig = {
    type: 'basic',
    paginationType: 'scroll',
    headers: [
      { title: 'Invoice', align: 'left', width: '10rem' },
      { title: 'Status', align: 'left', width: '27rem' },
      { title: 'Method', align: 'center', width: '40rem' },
      { title: 'Amount', align: 'right', width: '27rem' },
    ],
    rows: [
      [
        { type: 'text', value: 'INV001', align: 'left' },
        { type: 'text', value: 'Paid', align: 'left' },
        { type: 'text', value: 'Credit Card', align: 'center' },
        { type: 'text', value: '$250.00', align: 'right' },
      ],
      [
        { type: 'text', value: 'INV002', align: 'left' },
        { type: 'text', value: 'Pending', align: 'left' },
        { type: 'text', value: 'PayPal', align: 'center' },
        { type: 'text', value: '$150.00', align: 'right' },
      ],
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

  describe('tableConfig input', () => {
    it('should accept tableConfig input', () => {
      expect(component.tableConfig()).toEqual(mockTableConfig);
    });
  });

  describe('table structure', () => {
    it('should render table element', () => {
      const table = fixture.debugElement.query(By.css('.table'));
      expect(table).toBeTruthy();
    });

    it('should render thead element', () => {
      const thead = fixture.debugElement.query(By.css('.table__header'));
      expect(thead).toBeTruthy();
    });

    it('should render tbody element', () => {
      const tbody = fixture.debugElement.query(By.css('.table__body'));
      expect(tbody).toBeTruthy();
    });
  });

  describe('headers', () => {
    it('should render correct number of header cells', () => {
      const headerCells = fixture.debugElement.queryAll(
        By.css('.table__header__row__item'),
      );
      expect(headerCells.length).toBe(4);
    });

    it('should render correct header titles', () => {
      const headerCells = fixture.debugElement.queryAll(
        By.css('.table__header__row__item'),
      );
      const titles = headerCells.map((cell) =>
        cell.nativeElement.textContent.trim(),
      );
      expect(titles).toEqual(['Invoice', 'Status', 'Method', 'Amount']);
    });

    it('should apply correct text-align to headers', () => {
      const headerCells = fixture.debugElement.queryAll(
        By.css('.table__header__row__item'),
      );
      expect(headerCells[0].nativeElement.style.textAlign).toBe('left');
      expect(headerCells[2].nativeElement.style.textAlign).toBe('center');
      expect(headerCells[3].nativeElement.style.textAlign).toBe('right');
    });

    it('should apply correct width to headers', () => {
      const headerCells = fixture.debugElement.queryAll(
        By.css('.table__header__row__item'),
      );
      expect(headerCells[0].nativeElement.style.width).toBe('10rem');
      expect(headerCells[1].nativeElement.style.width).toBe('27rem');
      expect(headerCells[2].nativeElement.style.width).toBe('40rem');
    });
  });

  describe('rows', () => {
    it('should render correct number of rows', () => {
      const rows = fixture.debugElement.queryAll(By.css('.table__body__row'));
      expect(rows.length).toBe(2);
    });

    it('should render correct number of cells per row', () => {
      const rows = fixture.debugElement.queryAll(By.css('.table__body__row'));
      rows.forEach((row) => {
        const cells = row.queryAll(By.css('.table__body__row__item'));
        expect(cells.length).toBe(4);
      });
    });

    it('should render correct cell values in first row', () => {
      const firstRow = fixture.debugElement.query(By.css('.table__body__row'));
      const cells = firstRow.queryAll(By.css('.table__body__row__item'));
      const values = cells.map((cell) => cell.nativeElement.textContent.trim());
      expect(values).toEqual(['INV001', 'Paid', 'Credit Card', '$250.00']);
    });

    it('should apply correct text-align to cells', () => {
      const firstRow = fixture.debugElement.query(By.css('.table__body__row'));
      const cells = firstRow.queryAll(By.css('.table__body__row__item'));
      expect(cells[0].nativeElement.style.textAlign).toBe('left');
      expect(cells[2].nativeElement.style.textAlign).toBe('center');
      expect(cells[3].nativeElement.style.textAlign).toBe('right');
    });
  });
});

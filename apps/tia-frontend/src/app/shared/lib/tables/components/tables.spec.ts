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
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsTable } from './transactions-table';
import { Component } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { Tables } from '@tia/shared/lib/tables/components/tables';

@Component({
  selector: 'app-tables',
  template: '',
  standalone: true,
  inputs: ['config'],
})
class MockLibTable {}

describe('TransactionsTable', () => {
  let component: TransactionsTable;
  let fixture: ComponentFixture<TransactionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsTable],
    })
      .overrideComponent(TransactionsTable, {
        remove: { imports: [Tables] },
        add: { imports: [MockLibTable] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TransactionsTable);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('transactionsData', {
      rows: [],
      columns: [],
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});

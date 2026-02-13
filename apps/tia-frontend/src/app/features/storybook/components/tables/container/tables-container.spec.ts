import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablesContainer } from './tables-container';
import { TablesLayout } from '../components/tables-layout';
import { Component } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
  selector: 'app-tables-layout',
  standalone: true,
  template: '<div>Mock Layout</div>',
})
class TablesLayoutStub {}

describe('TablesContainer', () => {
  let component: TablesContainer;
  let fixture: ComponentFixture<TablesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesContainer],
    })
      .overrideComponent(TablesContainer, {
        remove: { imports: [TablesLayout] },
        add: { imports: [TablesLayoutStub] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TablesContainer);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

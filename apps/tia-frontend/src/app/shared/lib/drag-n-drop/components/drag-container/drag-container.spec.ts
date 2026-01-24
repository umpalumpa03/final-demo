import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragContainer } from './drag-container';
import { vi } from 'vitest';

describe('DragContainer', () => {
  let component: DragContainer;
  let fixture: ComponentFixture<DragContainer>;

  const mockItems = [
    { id: '1', title: 'Item 1', subtitle: 'S1' },
    { id: '2', title: 'Item 2', subtitle: 'S2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(DragContainer);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  it('should create and initialize with default values', () => {
    expect(component).toBeTruthy();
    expect(component.layout()).toBe('grid');
    expect(component.columns()).toBe(2);
  });

  it('should compute correct container classes based on layout', () => {
    fixture.componentRef.setInput('layout', 'list');
    fixture.detectChanges();
    expect(component['containerClasses']()).toBe(
      'drag-container__cards drag-container__cards--list',
    );
  });

  it('should compute correct container styles for grid layout', () => {
    fixture.componentRef.setInput('layout', 'grid');
    fixture.componentRef.setInput('columns', 3);
    fixture.detectChanges();
    expect(component['containerStyles']()).toEqual({ '--columns': 3 });
  });

  it('should return null for container styles when layout is not grid', () => {
    fixture.componentRef.setInput('layout', 'list');
    fixture.detectChanges();
    expect(component['containerStyles']()).toBeNull();
  });

  it('should swap items and emit changes on handleDrop', () => {
    const itemsSpy = vi.spyOn(component.itemsChange, 'emit');
    const orderSpy = vi.spyOn(component.orderChange, 'emit');

    component['handleDrop']('1', '2');

    const expectedItems = [mockItems[1], mockItems[0]];
    expect(itemsSpy).toHaveBeenCalledWith(expectedItems);
    expect(orderSpy).toHaveBeenCalledWith(['2', '1']);
  });

  it('should not emit if dragId or dropId is not found in items', () => {
    const itemsSpy = vi.spyOn(component.itemsChange, 'emit');
    component['handleDrop']('99', '1');
    expect(itemsSpy).not.toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragCard } from './drag-card';
import { vi } from 'vitest';

describe('DragCard', () => {
  let component: DragCard;
  let fixture: ComponentFixture<DragCard>;

  const mockItems = [
    { id: '1', title: 'Item 1', subtitle: 'Subtitle 1' },
    { id: '2', title: 'Item 2', subtitle: 'Subtitle 2' },
    { id: '3', title: 'Item 3', subtitle: 'Subtitle 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DragCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize internalItems signal from input', () => {
    const items = component.internalItems();
    expect(items.length).toBe(3);
    expect(items[0].id).toBe('1');
  });

  it('should set dragging state on drag start', () => {
    const event = { clientX: 100, clientY: 200 } as PointerEvent;
    component.onDragStartHandler('1', event);
    expect(component.draggingId()).toBe('1');
  });

  it('should remove item and emit events on remove', () => {
    const itemsChangeSpy = vi.spyOn(component.itemsChange, 'emit');
    const itemRemovedSpy = vi.spyOn(component.itemRemoved, 'emit');

    component.onRemove('1');

    const updatedItems = component.internalItems();
    expect(updatedItems.length).toBe(2);
    expect(updatedItems.find((item) => item.id === '1')).toBeUndefined();
    expect(itemsChangeSpy).toHaveBeenCalledWith(updatedItems);
    expect(itemRemovedSpy).toHaveBeenCalledWith('1');
  });

  it('should have correct default input values', () => {
    expect(component.canDelete()).toBe(false);
    expect(component.layout()).toBe('grid');
    expect(component.columns()).toBe(2);
  });

  it('should return correct container classes via computed signals', () => {
    fixture.componentRef.setInput('layout', 'list');
    fixture.detectChanges();
    expect(component['containerClasses']()).toBe(
      'draggable-cards draggable-cards--list',
    );
  });

  it('should return correct container styles for grid', () => {
    fixture.componentRef.setInput('layout', 'grid');
    fixture.componentRef.setInput('columns', 4);
    fixture.detectChanges();
    expect(component['containerStyles']()).toBe('--columns: 4');
  });

  it('should reorder items correctly on handleDrop', () => {
    const orderChangeSpy = vi.spyOn(component.orderChange, 'emit');

    component['handleDrop']('1', '3');

    const items = component.internalItems();
    expect(items[0].id).toBe('2');
    expect(items[1].id).toBe('3');
    expect(items[2].id).toBe('1');
    expect(orderChangeSpy).toHaveBeenCalledWith(['2', '3', '1']);
  });

  it('should reset internalItems when source input changes via linkedSignal', () => {
    const newMockItems = [{ id: '99', title: 'New', subtitle: 'New' }];
    fixture.componentRef.setInput('items', newMockItems);
    fixture.detectChanges();

    expect(component.internalItems().length).toBe(1);
    expect(component.internalItems()[0].id).toBe('99');
  });
});

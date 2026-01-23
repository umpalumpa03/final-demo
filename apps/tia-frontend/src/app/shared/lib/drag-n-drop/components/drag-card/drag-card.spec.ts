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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize internalItems from input', () => {
    expect(component.internalItems.length).toBe(3);
    expect(component.internalItems[0].id).toBe('1');
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

    expect(component.internalItems.length).toBe(2);
    expect(
      component.internalItems.find((item) => item.id === '1'),
    ).toBeUndefined();
    expect(itemsChangeSpy).toHaveBeenCalledWith(component.internalItems);
    expect(itemRemovedSpy).toHaveBeenCalledWith('1');
  });

  it('should return correct container classes for grid', () => {
    fixture.componentRef.setInput('layout', 'grid');
    fixture.detectChanges();

    expect(component['containerClasses']()).toBe(
      'draggable-cards draggable-cards--grid',
    );
  });

  it('should return correct container classes for list', () => {
    fixture.componentRef.setInput('layout', 'list');
    fixture.detectChanges();

    expect(component['containerClasses']()).toBe(
      'draggable-cards draggable-cards--list',
    );
  });

  it('should return container styles for grid layout', () => {
    fixture.componentRef.setInput('layout', 'grid');
    fixture.componentRef.setInput('columns', 3);
    fixture.detectChanges();

    expect(component['containerStyles']()).toBe('--columns: 3');
  });

  it('should return null container styles for list layout', () => {
    fixture.componentRef.setInput('layout', 'list');
    fixture.detectChanges();

    expect(component['containerStyles']()).toBeNull();
  });

  it('should have default input values', () => {
    expect(component.canDelete()).toBe(false);
    expect(component.layout()).toBe('grid');
    expect(component.columns()).toBe(2);
    expect(component.cardTitle()).toBe('Draggable Cards');
    expect(component.cardDescription()).toBe(
      'Drag Cards to reorder them in a grid layout',
    );
  });

  it('should emit orderChange after reorder', () => {
    const itemsChangeSpy = vi.spyOn(component.itemsChange, 'emit');
    const orderChangeSpy = vi.spyOn(component.orderChange, 'emit');

    component['handleDrop']('1', '3');

    expect(itemsChangeSpy).toHaveBeenCalled();
    expect(orderChangeSpy).toHaveBeenCalled();
  });

  it('should reorder items correctly on handleDrop', () => {
    component['handleDrop']('1', '3');

    expect(component.internalItems[0].id).toBe('2');
    expect(component.internalItems[1].id).toBe('3');
    expect(component.internalItems[2].id).toBe('1');
  });
});

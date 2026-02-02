import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragCard } from './drag-card';
import { vi } from 'vitest';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('DragCard', () => {
  let component: DragCard;
  let fixture: ComponentFixture<DragCard>;

  const mockTranslate = {
    instant: (key: string) => key,
    get: vi.fn(() => of('translated')),
    stream: vi.fn(() => of('translated')),
    use: vi.fn(),
    currentLang: 'en',
    onLangChange: of({ lang: 'en', translations: {} }),
    onTranslationChange: of({ lang: 'en', translations: {} }),
    onDefaultLangChange: of({ lang: 'en', translations: {} })
  };

  const mockItems = [
    { id: '1', title: 'Item 1', subtitle: 'Subtitle 1' },
    { id: '2', title: 'Item 2', subtitle: 'Subtitle 2' },
    { id: '3', title: 'Item 3', subtitle: 'Subtitle 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragCard],
      providers: [
        { provide: TranslateService, useValue: mockTranslate }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DragCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  it('should create and initialize with correct defaults', () => {
    expect(component).toBeTruthy();
    expect(component.canDelete()).toBe(false);
    expect(component.layout()).toBe('grid');
    expect(component.columns()).toBe(2);
    expect(component.internalItems().length).toBe(3);
  });

  it('should handle dragging state and style computations', () => {
    const event = { clientX: 100, clientY: 200 } as PointerEvent;
    component.onDragStartHandler('1', event);
    expect(component.draggingId()).toBe('1');

    fixture.componentRef.setInput('layout', 'list');
    fixture.detectChanges();
    expect(component['containerClasses']()).toBe(
      'draggable-cards draggable-cards--list',
    );

    fixture.componentRef.setInput('layout', 'grid');
    fixture.componentRef.setInput('columns', 4);
    fixture.detectChanges();
    expect(component['containerStyles']()).toBe('--columns: 4');
  });

  it('should remove item and update state', () => {
    const itemsChangeSpy = vi.spyOn(component.itemsChange, 'emit');
    const itemRemovedSpy = vi.spyOn(component.itemRemoved, 'emit');

    component.onRemove('1');

    const updatedItems = component.internalItems();
    expect(updatedItems.length).toBe(2);
    expect(itemsChangeSpy).toHaveBeenCalledWith(updatedItems);
    expect(itemRemovedSpy).toHaveBeenCalledWith('1');
  });

  it('should reorder items correctly on handleDrop using directional push', () => {
    const orderChangeSpy = vi.spyOn(component.orderChange, 'emit');

    component['handleDrop']('3', '1');

    const items = component.internalItems();
    expect(items[0].id).toBe('3');
    expect(items[1].id).toBe('1');
    expect(items[2].id).toBe('2');
    expect(orderChangeSpy).toHaveBeenCalledWith(['3', '1', '2']);
  });

  it('should exit early on invalid handleDrop IDs', () => {
    const orderChangeSpy = vi.spyOn(component.orderChange, 'emit');
    component['handleDrop']('non-existent', '1');
    expect(orderChangeSpy).not.toHaveBeenCalled();
  });

  it('should emit all auxiliary event outputs', () => {
    const editSpy = vi.spyOn(component.itemEdited, 'emit');
    const addSpy = vi.spyOn(component.itemAdded, 'emit');
    const viewSpy = vi.spyOn(component.viewOptionChanged, 'emit');
    const pageSpy = vi.spyOn(component.paginationChanged, 'emit');

    component.onEdit('1');
    component.onAdd('1');
    component.onViewOptionChange('1', false);
    component.onPaginationChange('1', 20);

    expect(editSpy).toHaveBeenCalledWith('1');
    expect(addSpy).toHaveBeenCalledWith('1');
    expect(viewSpy).toHaveBeenCalledWith({ id: '1', isViewable: false });
    expect(pageSpy).toHaveBeenCalledWith({ id: '1', value: 20 });
  });

  it('should reset internalItems via linkedSignal when input changes', () => {
    const newMockItems = [{ id: '99', title: 'New', subtitle: 'New' }];
    fixture.componentRef.setInput('items', newMockItems);
    fixture.detectChanges();

    expect(component.internalItems().length).toBe(1);
    expect(component.internalItems()[0].id).toBe('99');
  });
});

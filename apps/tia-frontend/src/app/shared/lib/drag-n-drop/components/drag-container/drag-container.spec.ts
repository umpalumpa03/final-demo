import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragContainer } from './drag-container';
import { vi } from 'vitest';

describe('DragContainer', () => {
  let component: DragContainer;
  let fixture: ComponentFixture<DragContainer>;

  const mockItems = [
    { id: '1', title: 'Item 1', subtitle: 'S1' },
    { id: '2', title: 'Item 2', subtitle: 'S2' },
    { id: '3', title: 'Item 3', subtitle: 'S3' },
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

  it('should compute responsive container styles', () => {
    fixture.componentRef.setInput('layout', 'grid');
    fixture.componentRef.setInput('columns', { default: 4, md: 2, sm: 1 });
    fixture.detectChanges();
    expect(component['containerStyles']()).toBe(
      '--columns: 4; --columns-md: 2; --columns-sm: 1',
    );
  });

  it('should handle partial responsive config', () => {
    fixture.componentRef.setInput('layout', 'grid');
    fixture.componentRef.setInput('columns', { default: 3, sm: 1 });
    fixture.detectChanges();
    expect(component['containerStyles']()).toBe(
      '--columns: 3; --columns-sm: 1',
    );
  });

  it('should compute correct container styles for grid layout', () => {
    fixture.componentRef.setInput('layout', 'grid');
    fixture.componentRef.setInput('columns', 3);
    fixture.detectChanges();
    expect(component['containerStyles']()).toBe('--columns: 3');
  });

  it('should return null for container styles when layout is not grid', () => {
    fixture.componentRef.setInput('layout', 'list');
    fixture.detectChanges();
    expect(component['containerStyles']()).toBeNull();
  });

  it('should reorder items using directional push and emit changes', () => {
    const itemsSpy = vi.spyOn(component.itemsChange, 'emit');
    const orderSpy = vi.spyOn(component.orderChange, 'emit');

    component['handleDrop']('1', '2');

    expect(itemsSpy).toHaveBeenCalledWith([
      mockItems[1],
      mockItems[0],
      mockItems[2],
    ]);
    expect(orderSpy).toHaveBeenCalledWith(['2', '1', '3']);
  });

  it('should not emit if dragId or dropId is not found in items', () => {
    const itemsSpy = vi.spyOn(component.itemsChange, 'emit');
    component['handleDrop']('99', '1');
    expect(itemsSpy).not.toHaveBeenCalled();
  });
});

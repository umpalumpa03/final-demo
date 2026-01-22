import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraggableCard } from './draggable-card';
import { vi } from 'vitest';

describe('DraggableCard', () => {
  let component: DraggableCard;
  let fixture: ComponentFixture<DraggableCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DraggableCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('itemData', {
      id: '1',
      title: 'Test',
      subtitle: 'Test subtitle',
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit dragStart with event', () => {
    const event = { preventDefault: vi.fn() } as unknown as PointerEvent;
    const spy = vi.spyOn(component.dragStart, 'emit');

    component.onDragStartPoint(event);

    expect(spy).toHaveBeenCalledWith(event);
  });

  it('should emit remove', () => {
    const spy = vi.spyOn(component.remove, 'emit');

    component.onRemove();

    expect(spy).toHaveBeenCalled();
  });
});
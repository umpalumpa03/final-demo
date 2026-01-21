import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraggableCard } from './draggableCard';
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
    fixture.componentRef.setInput('index', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit dragStart on pointer down', () => {
    fixture.componentRef.setInput('index', 2);
    const event = { preventDefault: vi.fn() } as unknown as PointerEvent;
    const spy = vi.spyOn(component.dragStart, 'emit');
  
    component.onDragStartPoint(event);
  
    expect(spy).toHaveBeenCalledWith({ index: 2, event });
  });

  it('should emit remove with index', () => {
    fixture.componentRef.setInput('index', 3);
    const spy = vi.spyOn(component.remove, 'emit');

    component.onRemove();

    expect(spy).toHaveBeenCalledWith(3);
  });
});

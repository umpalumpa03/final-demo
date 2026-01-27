import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DragItemDirective } from './drag-item.directive';
import { DraggableCard } from '../components/draggable-card/draggable-card';
import { DRAG_CONTAINER } from '../model/drag.provider';

@Component({
  template: `<div appDragItem></div>`,
  imports: [DragItemDirective],
})
class TestHostComponent {}

describe('DragItemDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let mockContainer: any;
  let mockCard: any;

  beforeEach(async () => {
    mockContainer = {
      draggingId: signal<string | null>(null),
      dropTargetId: signal<string | null>(null),
      draggingStyle: signal({
        transform: 'translate(10px, 10px)',
        zIndex: 100,
      }),
      getColspanForItem: () => null,
    };

    mockCard = {
      itemData: signal({ id: 'card-1' }),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: DRAG_CONTAINER, useValue: mockContainer },
        { provide: DraggableCard, useValue: mockCard },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply data-card-id attribute', () => {
    const div = fixture.debugElement.query(By.directive(DragItemDirective));
    expect(div.attributes['data-card-id']).toBe('card-1');
  });

  it('should apply active classes when dragging or drop targeting', () => {
    const div = fixture.nativeElement.querySelector('div');

    mockContainer.draggingId.set('card-1');
    fixture.detectChanges();
    expect(div.classList.contains('is-dragging')).toBe(true);

    mockContainer.dropTargetId.set('card-1');
    fixture.detectChanges();
    expect(div.classList.contains('is-drop-target')).toBe(true);
  });

  it('should apply dragging styles only when active', () => {
    const div = fixture.nativeElement.querySelector('div');

    expect(div.style.transform).toBe('');

    mockContainer.draggingId.set('card-1');
    fixture.detectChanges();

    expect(div.style.transform).toBe('translate(10px, 10px)');
    expect(div.style.zIndex).toBe('100');
  });
});

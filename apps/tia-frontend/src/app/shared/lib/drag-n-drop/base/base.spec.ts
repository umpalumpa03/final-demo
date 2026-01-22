import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragBase } from './base';

@Component({
  selector: 'app-test-drag',
  template: '',
})
class TestDragComponent extends DragBase {
  public handleDropCalled = false;
  public lastDragId: string | null = null;
  public lastDropId: string | null = null;

  protected override handleDrop(dragId: string, dropId: string): void {
    this.handleDropCalled = true;
    this.lastDragId = dragId;
    this.lastDropId = dropId;
  }
}

describe('DragBase', () => {
  let component: TestDragComponent;
  let fixture: ComponentFixture<TestDragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDragComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial null drag state', () => {
    expect(component.draggingId()).toBeNull();
    expect(component.dropTargetId()).toBeNull();
  });

  it('should clean up listeners on destroy', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    component.ngOnDestroy();

    expect(removeSpy).toHaveBeenCalled();
  });
});

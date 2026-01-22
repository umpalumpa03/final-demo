import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragAndDropContainer } from './drag-and-drop';

describe('DragAndDropContainer', () => {
  let component: DragAndDropContainer;
  let fixture: ComponentFixture<DragAndDropContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragAndDropContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(DragAndDropContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

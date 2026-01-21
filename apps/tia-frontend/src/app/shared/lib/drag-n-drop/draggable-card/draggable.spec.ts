import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraggableCard } from './draggable';

describe('DraggableCard', () => {
  let component: DraggableCard;
  let fixture: ComponentFixture<DraggableCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DraggableCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

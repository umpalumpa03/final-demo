import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardGridSkeleton } from './card-grid-skeleton';

describe('CardGridSkeleton', () => {
  let component: CardGridSkeleton;
  let fixture: ComponentFixture<CardGridSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGridSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(CardGridSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

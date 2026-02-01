import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardGridItem } from './card-grid-item';

describe('CardGridItem', () => {
  let component: CardGridItem;
  let fixture: ComponentFixture<CardGridItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGridItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CardGridItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

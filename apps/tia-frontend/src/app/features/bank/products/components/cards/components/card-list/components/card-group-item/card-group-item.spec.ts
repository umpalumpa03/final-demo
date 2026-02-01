import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardGroupItem } from './card-group-item';

describe('CardGroupItem', () => {
  let component: CardGroupItem;
  let fixture: ComponentFixture<CardGroupItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGroupItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CardGroupItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

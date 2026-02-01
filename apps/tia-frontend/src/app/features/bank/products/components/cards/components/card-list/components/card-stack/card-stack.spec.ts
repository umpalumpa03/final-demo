import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardStack } from './card-stack';

describe('CardStack', () => {
  let component: CardStack;
  let fixture: ComponentFixture<CardStack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardStack],
    }).compileComponents();

    fixture = TestBed.createComponent(CardStack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Feedback } from './feedback';
import {
  IMAGE_SKELETONS, LIST_ITEMS,
  LOADING_CARDS, TEXT_SKELETONS
} from './config/feedback.config';

describe('Feedback', () => {
  let component: Feedback;
  let fixture: ComponentFixture<Feedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Feedback],
    }).compileComponents();

    fixture = TestBed.createComponent(Feedback);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loadingCards from config', () => {
    expect(component.loadingCards).toBe(LOADING_CARDS);
    expect(component.loadingCards.length).toBe(2);
  });

  it('should initialize textSkeletons from config', () => {
    expect(component.textSkeletons).toBe(TEXT_SKELETONS);
    expect(component.textSkeletons.length).toBe(3);
  });

  it('should initialize imageSkeletons from config', () => {
    expect(component.imageSkeletons).toBe(IMAGE_SKELETONS);
    expect(component.imageSkeletons.length).toBe(3);
  });

  it('should initialize listItems from config', () => {
    expect(component.listItems).toBe(LIST_ITEMS);
    expect(component.listItems.length).toBe(3);
  });
});

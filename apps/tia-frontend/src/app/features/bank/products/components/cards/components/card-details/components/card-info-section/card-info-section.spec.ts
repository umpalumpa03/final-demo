import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardInfoSection } from './card-info-section';

describe('CardInfoSection', () => {
  let component: CardInfoSection;
  let fixture: ComponentFixture<CardInfoSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInfoSection],
    }).compileComponents();

    fixture = TestBed.createComponent(CardInfoSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

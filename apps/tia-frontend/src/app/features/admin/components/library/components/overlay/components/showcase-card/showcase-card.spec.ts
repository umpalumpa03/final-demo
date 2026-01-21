import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowcaseCard } from './showcase-card';

describe('ShowcaseCard', () => {
  let component: ShowcaseCard;
  let fixture: ComponentFixture<ShowcaseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowcaseCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

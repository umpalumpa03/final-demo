import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

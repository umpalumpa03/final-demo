import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepliesCard } from './replies-card';

describe('RepliesCard', () => {
  let component: RepliesCard;
  let fixture: ComponentFixture<RepliesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepliesCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RepliesCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

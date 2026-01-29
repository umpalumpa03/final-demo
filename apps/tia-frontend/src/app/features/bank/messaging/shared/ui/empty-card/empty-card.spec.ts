import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyCard } from './empty-card';

describe('EmptyCard', () => {
  let component: EmptyCard;
  let fixture: ComponentFixture<EmptyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyCard],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

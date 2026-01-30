import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCard } from './createCard';

describe('CreateCard', () => {
  let component: CreateCard;
  let fixture: ComponentFixture<CreateCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

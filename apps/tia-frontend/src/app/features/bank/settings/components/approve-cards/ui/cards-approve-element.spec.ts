import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardsApproveElement } from './cards-approve-element';

describe('CardsApproveElement', () => {
  let component: CardsApproveElement;
  let fixture: ComponentFixture<CardsApproveElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsApproveElement],
    }).compileComponents();

    fixture = TestBed.createComponent(CardsApproveElement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

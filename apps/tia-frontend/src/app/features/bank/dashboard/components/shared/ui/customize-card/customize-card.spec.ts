import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizeCard } from './customize-card';

describe('CustomizeCard', () => {
  let component: CustomizeCard;
  let fixture: ComponentFixture<CustomizeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizeCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomizeCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

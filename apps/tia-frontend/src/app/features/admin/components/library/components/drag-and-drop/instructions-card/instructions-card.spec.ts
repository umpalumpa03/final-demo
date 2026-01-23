import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructionsCard } from './instructions-card';

describe('InstructionsCard', () => {
  let component: InstructionsCard;
  let fixture: ComponentFixture<InstructionsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
